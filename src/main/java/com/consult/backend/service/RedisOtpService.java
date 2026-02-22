package com.consult.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Duration;

@Service
@RequiredArgsConstructor
public class RedisOtpService {
    private final RedisTemplate<String, Object> redisTemplate;

    private static final String OTP_PREFIX = "otp:";
    private static final String VERIFIED_PREFIX = "otp:verified:";
    private static final String ATTEMPTS_PREFIX = "otp:attempts:";

    private static final Duration OTP_TTL = Duration.ofMinutes(5);
    private static final Duration VERIFIED_TTL = Duration.ofMinutes(10);

    private static final int MAX_ATTEMPTS = 5;

    private final SecureRandom random = new SecureRandom();

    /*
     =========================================
     GENERATE & STORE OTP
     =========================================
    */
    public String generateOtp(String email) {

        int otp = 100000 + random.nextInt(900000);
        String otpStr = String.valueOf(otp);

        String key = OTP_PREFIX + email;

        redisTemplate.opsForValue().set(key, otpStr, OTP_TTL);

        // Reset attempts counter
        redisTemplate.delete(ATTEMPTS_PREFIX + email);

        return otpStr;
    }

    /*
     =========================================
     VERIFY OTP
     =========================================
    */
    public boolean verifyOtp(String email, String otp) {

        String key = OTP_PREFIX + email;

        String storedOtp = (String) redisTemplate.opsForValue().get(key);

        if (storedOtp == null) {
            return false; // expired
        }

        // Check attempts
        if (isMaxAttemptsReached(email)) {
            return false;
        }

        if (!storedOtp.equals(otp)) {
            incrementAttempts(email);
            return false;
        }

        // SUCCESS → mark verified
        redisTemplate.delete(key);

        redisTemplate.opsForValue().set(
                VERIFIED_PREFIX + email,
                "true",
                VERIFIED_TTL
        );

        return true;
    }

    /*
     =========================================
     CHECK VERIFIED
     =========================================
    */
    public boolean isOtpVerified(String email) {
        return redisTemplate.hasKey(VERIFIED_PREFIX + email);
    }

    /*
     =========================================
     CLEAR VERIFICATION (after password reset)
     =========================================
    */
    public void clearVerification(String email) {
        redisTemplate.delete(VERIFIED_PREFIX + email);
    }

    /*
     =========================================
     ATTEMPT TRACKING
     =========================================
    */
    private void incrementAttempts(String email) {

        String key = ATTEMPTS_PREFIX + email;

        Long attempts = redisTemplate.opsForValue().increment(key);

        if (attempts != null && attempts == 1) {
            redisTemplate.expire(key, OTP_TTL);
        }
    }

    private boolean isMaxAttemptsReached(String email) {

        String key = ATTEMPTS_PREFIX + email;

        Integer attempts = (Integer) redisTemplate.opsForValue().get(key);

        return attempts != null && attempts >= MAX_ATTEMPTS;
    }
}
