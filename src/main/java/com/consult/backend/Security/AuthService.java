package com.consult.backend.Security;

import com.consult.backend.Redis.RedisLoginAttemptService;
import com.consult.backend.dto.LoginRequestDto;
import com.consult.backend.dto.LoginResponseDto;
import com.consult.backend.dto.SignupRequestDto;
import com.consult.backend.dto.SignupResponseDto;
import com.consult.backend.entity.Entity.Role;
import com.consult.backend.entity.RefreshToken;
import com.consult.backend.entity.User;
import com.consult.backend.repository.RefreshTokenRepository;
import com.consult.backend.repository.UserRepository;
import com.consult.backend.service.RedisSessionService;
import com.consult.backend.service.TokenBlacklistService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.UUID;


@Service
@RequiredArgsConstructor
public class AuthService {
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;
    private final TokenBlacklistService blacklistService;
    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtUtil jwtUtil;
    private final RedisLoginAttemptService loginAttemptService;
    private final RedisSessionService redisSessionService;

    /*
     ======================================
     SIGNUP
     ======================================
    */
    public SignupResponseDto signup(SignupRequestDto dto) {

        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User user = User.builder()
                .email(dto.getEmail())
                .password(passwordEncoder.encode(dto.getPassword()))
                .role(Role.USER)
                .enabled(true)
                .accountNonLocked(true)
                .build();

        userRepository.save(user);

        return new SignupResponseDto(user.getId(), user.getEmail());
    }

    /*
     ======================================
     LOGIN
     ======================================
    */
    public LoginResponseDto login(LoginRequestDto dto) {
        String email = dto.getEmail();

        /*
         ======================================
         STEP 1 — CHECK RATE LIMIT
         ======================================
        */
        if (loginAttemptService.isBlocked(email)) {
            throw new RuntimeException("Too many failed attempts. Try again later.");
        }

        try {

        /*
         ======================================
         STEP 2 — AUTHENTICATE USER
         ======================================
        */
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            email,
                            dto.getPassword()
                    )
            );

        } catch (Exception ex) {

        /*
         ======================================
         STEP 3 — RECORD FAILED ATTEMPT
         ======================================
        */
            loginAttemptService.loginFailed(email);

            throw new RuntimeException("Invalid email or password");
        }

        /*
         ======================================
         STEP 4 — RESET ATTEMPTS ON SUCCESS
         ======================================
        */
        loginAttemptService.loginSucceeded(email);

        /*
         ======================================
         CONTINUE NORMAL LOGIN FLOW
         ======================================
        */
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        dto.getEmail(),
                        dto.getPassword()
                )
        );

        User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String accessToken = jwtUtil.generateAccessToken(
                user.getId(),
                user.getEmail(),
                user.getRole().name()
        );


        String refreshToken = createRefreshToken(user);

        return new LoginResponseDto(
                accessToken,
                refreshToken,
                user.getId(),
                user.getEmail(),
                user.getRole().name()
        );

    }

    /*
     ======================================
     CREATE REFRESH TOKEN
     ======================================
    */
    private String createRefreshToken(User user) {

        String refreshJwt = jwtUtil.generateRefreshToken(
                user.getId(),
                user.getEmail()
        );

        String tokenId = jwtUtil.extractTokenId(refreshJwt);

        LocalDateTime expiry = jwtUtil.extractExpiry(refreshJwt)
                .toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDateTime();

        String sessionId = UUID.randomUUID().toString();

        RefreshToken refreshToken = RefreshToken.builder()
                .tokenId(tokenId)
                .sessionId(sessionId)
                .user(user)
                .expiryDate(expiry)
                .revoked(false)
                .build();

        refreshTokenRepository.save(refreshToken);

        // ⭐ STORE IN REDIS
        redisSessionService.storeSession(
                tokenId,
                sessionId,
                Duration.between(LocalDateTime.now(), expiry)
        );

        return refreshJwt;
    }



    /*
 ======================================
 REFRESH ACCESS TOKEN (ROTATION ENABLED)
 ======================================
*/
    @Transactional
    public LoginResponseDto refreshAccessToken(String refreshToken) {

        // Validate JWT
        if (!jwtUtil.isTokenValid(refreshToken)) {
            throw new RuntimeException("Invalid refresh token");
        }

        if (!"REFRESH".equals(jwtUtil.extractTokenType(refreshToken))) {
            throw new RuntimeException("Invalid token type");
        }

        // Extract tokenId
        String tokenId = jwtUtil.extractTokenId(refreshToken);

        // Fetch DB token
        RefreshToken token = refreshTokenRepository.findByTokenId(tokenId)
                .orElseThrow(() -> new RuntimeException("Refresh token not found"));

        // Security checks
        if (token.isRevoked()) {
            throw new RuntimeException("Token already revoked");
        }

        if (token.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Refresh token expired");
        }

        // NEW — REDIS SESSION VALIDATION
        if (!redisSessionService.isSessionActive(tokenId)) {
            throw new RuntimeException("Session expired or logged out");
        }

        User user = token.getUser();

        // ROTATE — revoke old token
        token.setRevoked(true);
        refreshTokenRepository.save(token);

        // Create NEW refresh token (also creates new Redis session)
        String newRefreshToken = createRefreshToken(user);

        //  Create new access token
        String newAccessToken = jwtUtil.generateAccessToken(
                user.getId(),
                user.getEmail(),
                user.getRole().name()
        );

        //  Return BOTH tokens
        return new LoginResponseDto(
                newAccessToken,
                newRefreshToken,
                user.getId(),
                user.getEmail(),
                user.getRole().name()
        );
    }



    /*
     ======================================
     LOGOUT
     ======================================
    */
    public void logout(String accessToken, String refreshToken) {

        // ============================
        // BLACKLIST ACCESS TOKEN
        // ============================

        long expiryMillis =
                jwtUtil.extractExpiry(accessToken).getTime() - System.currentTimeMillis();

        blacklistService.blacklistToken(accessToken, expiryMillis);

        // ============================
        // REVOKE REFRESH TOKEN
        // ============================

        String tokenId = jwtUtil.extractTokenId(refreshToken);

        RefreshToken token = refreshTokenRepository.findByTokenId(tokenId)
                .orElseThrow(() -> new RuntimeException("Token not found"));



        // Revoke DB token
        token.setRevoked(true);
        refreshTokenRepository.save(token);

        // DELETE REDIS SESSION
        redisSessionService.deleteSession(tokenId);

    }


}
