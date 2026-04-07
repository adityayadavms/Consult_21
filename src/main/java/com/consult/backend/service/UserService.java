package com.consult.backend.service;

import com.consult.backend.dto.*;
import com.consult.backend.entity.User;
import com.consult.backend.repository.UserRepository;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final RedisTemplate<String, Map<String, String>> phoneRedisTemplate;
    private final EmailService emailService;

    private static final String PHONE_UPDATE_PREFIX = "phone_update:";
    private static final String RESEND_PREFIX = "phone_resend:";
    private static final String COOLDOWN_PREFIX = "phone_cooldown:";

    private static final int MAX_ATTEMPTS = 5;
    private static final int MAX_RESEND_ATTEMPTS = 3;

    private static final Duration OTP_EXPIRY = Duration.ofMinutes(5);
    private static final Duration RESEND_WINDOW = Duration.ofMinutes(5);
    private static final Duration COOLDOWN_TIME = Duration.ofMinutes(1);

    private static final SecureRandom secureRandom = new SecureRandom();

    public UserService(
            UserRepository userRepository,
            @Qualifier("phoneRedisTemplate") RedisTemplate<String, Map<String, String>> phoneRedisTemplate,
            EmailService emailService
    ) {
        this.userRepository = userRepository;
        this.phoneRedisTemplate = phoneRedisTemplate;
        this.emailService = emailService;
    }

    // ============================
    // GET CURRENT USER
    // ============================
    public UserProfileDto getCurrentUser() {
        return mapToDto(getLoggedInUser());
    }

    // ============================
    // UPDATE NAME
    // ============================
    public UserProfileDto updateProfile(UpdateProfileRequestDto dto) {

        if (dto.getName() == null || dto.getName().trim().isEmpty()) {
            throw new RuntimeException("Name cannot be empty");
        }

        User user = getLoggedInUser();

        user.setName(dto.getName());
        userRepository.save(user);

        return mapToDto(user);
    }

    // ============================
    // REQUEST PHONE UPDATE
    // ============================
    public void requestPhoneUpdate(String phone) {

        User user = getLoggedInUser();

        if (phone == null || !phone.matches("\\d{10}")) {
            throw new RuntimeException("Invalid phone number");
        }

        if (userRepository.existsByPhone(phone)) {
            throw new RuntimeException("Phone already in use");
        }

        String key = PHONE_UPDATE_PREFIX + user.getEmail();

        if (phoneRedisTemplate.hasKey(key)) {
            throw new RuntimeException("OTP already sent. Use resend option.");
        }

        String otp = generateOtp();
        String hashedOtp = hashOtp(otp);

        Map<String, String> data = new HashMap<>();
        data.put("otp", hashedOtp);
        data.put("phone", phone);
        data.put("attempts", "0");

        phoneRedisTemplate.opsForValue().set(key, data, OTP_EXPIRY);

        emailService.sendOtpEmail(user.getEmail(), otp);
    }

    // ============================
    // VERIFY PHONE UPDATE
    // ============================
    @Transactional
    public UserProfileDto verifyPhoneUpdate(String otp) {

        User user = getLoggedInUser();
        String key = PHONE_UPDATE_PREFIX + user.getEmail();

        Map<String, String> data = phoneRedisTemplate.opsForValue().get(key);

        if (data == null) {
            throw new RuntimeException("OTP expired or not requested");
        }

        int attempts = getAttempts(data);

        if (attempts >= MAX_ATTEMPTS) {
            phoneRedisTemplate.delete(key);
            throw new RuntimeException("Too many failed attempts");
        }

        if (!data.get("otp").equals(hashOtp(otp))) {
            incrementAttempts(key, data);
            throw new RuntimeException("Invalid OTP");
        }

        user.setPhone(data.get("phone"));
        userRepository.save(user);

        phoneRedisTemplate.delete(key);

        return mapToDto(user);
    }

    // ============================
    // RESEND PHONE OTP
    // ============================
    public void resendPhoneOtp() {

        User user = getLoggedInUser();

        String email = user.getEmail();
        String dataKey = PHONE_UPDATE_PREFIX + email;
        String resendKey = RESEND_PREFIX + email;
        String cooldownKey = COOLDOWN_PREFIX + email;

        Map<String, String> existingData = phoneRedisTemplate.opsForValue().get(dataKey);

        if (existingData == null) {
            throw new RuntimeException("No OTP request found. Please request again.");
        }

        // Cooldown check
        if (phoneRedisTemplate.hasKey(cooldownKey)) {
            throw new RuntimeException("Please wait before requesting another OTP.");
        }

        // Resend attempts check
        Map<String, String> resendData = phoneRedisTemplate.opsForValue().get(resendKey);

        int attempts = 0;
        if (resendData != null && resendData.get("count") != null) {
            attempts = Integer.parseInt(resendData.get("count"));
        }

        if (attempts >= MAX_RESEND_ATTEMPTS) {
            throw new RuntimeException("Too many OTP requests. Try again later.");
        }

        // Increment resend count
        attempts++;
        Map<String, String> newResendData = new HashMap<>();
        newResendData.put("count", String.valueOf(attempts));

        phoneRedisTemplate.opsForValue()
                .set(resendKey, newResendData, RESEND_WINDOW);

        // Generate new OTP
        String otp = generateOtp();
        String hashedOtp = hashOtp(otp);

        existingData.put("otp", hashedOtp);
        existingData.put("attempts", "0");

        phoneRedisTemplate.opsForValue()
                .set(dataKey, existingData, OTP_EXPIRY);

        emailService.sendOtpEmail(email, otp);

        // Start cooldown
        Map<String, String> cooldownData = new HashMap<>();
        cooldownData.put("status", "LOCKED");

        phoneRedisTemplate.opsForValue()
                .set(cooldownKey, cooldownData, COOLDOWN_TIME);
    }

    // ============================
    // HELPERS
    // ============================

    private User getLoggedInUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private UserProfileDto mapToDto(User user) {
        return UserProfileDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .build();
    }

    private String generateOtp() {
        return String.valueOf(100000 + secureRandom.nextInt(900000));
    }

    private String hashOtp(String otp) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hash = md.digest(otp.getBytes(StandardCharsets.UTF_8));

            StringBuilder hex = new StringBuilder();
            for (byte b : hash) {
                hex.append(String.format("%02x", b));
            }
            return hex.toString();

        } catch (Exception e) {
            throw new RuntimeException("Error hashing OTP");
        }
    }

    private int getAttempts(Map<String, String> data) {
        String attempts = data.get("attempts");
        return attempts == null ? 0 : Integer.parseInt(attempts);
    }

    private void incrementAttempts(String key, Map<String, String> data) {
        int attempts = getAttempts(data);
        data.put("attempts", String.valueOf(attempts + 1));

        phoneRedisTemplate.opsForValue()
                .set(key, data, OTP_EXPIRY);
    }
}