package com.consult.backend.Security;

import com.consult.backend.dto.LoginRequestDto;
import com.consult.backend.dto.LoginResponseDto;
import com.consult.backend.dto.SignupRequestDto;
import com.consult.backend.dto.SignupResponseDto;
import com.consult.backend.entity.Entity.Role;
import com.consult.backend.entity.RefreshToken;
import com.consult.backend.entity.User;
import com.consult.backend.repository.RefreshTokenRepository;
import com.consult.backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;



@Service
@RequiredArgsConstructor
public class AuthService {
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtUtil jwtUtil;

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

        // Step 1 — Generate JWT refresh token
        String refreshJwt = jwtUtil.generateRefreshToken(user.getEmail());

        // Step 2 — Extract tokenId from JWT
        String tokenId = jwtUtil.extractTokenId(refreshJwt);

        // Step 3 — Extract expiry from JWT
        LocalDateTime expiry = jwtUtil.extractExpiry(refreshJwt)
                .toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDateTime();

        // Step 4 — Store metadata in DB
        RefreshToken refreshToken = RefreshToken.builder()
                .token(refreshJwt)
                .tokenId(tokenId)
                .user(user)
                .expiryDate(expiry)
                .revoked(false)
                .build();

        refreshTokenRepository.save(refreshToken);

        return refreshJwt;
    }


    /*
     ======================================
     REFRESH ACCESS TOKEN
     ======================================
    */
    @Transactional
    public String refreshAccessToken(String refreshToken) {

        if (!jwtUtil.isTokenValid(refreshToken)) {
            throw new RuntimeException("Invalid refresh token");
        }

        if (!"REFRESH".equals(jwtUtil.extractTokenType(refreshToken))) {
            throw new RuntimeException("Invalid token type");
        }

        String tokenId = jwtUtil.extractTokenId(refreshToken);

        RefreshToken token = refreshTokenRepository.findByTokenId(tokenId)
                .orElseThrow(() -> new RuntimeException("Refresh token not found"));

        if (token.isRevoked()) {
            throw new RuntimeException("Token revoked");
        }

        if (token.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token expired");
        }

        User user = token.getUser();

        return jwtUtil.generateAccessToken(
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
    public void logout(String refreshToken) {

        String tokenId = jwtUtil.extractTokenId(refreshToken);

        RefreshToken token = refreshTokenRepository.findByTokenId(tokenId)
                .orElseThrow(() -> new RuntimeException("Token not found"));

        token.setRevoked(true);

        refreshTokenRepository.save(token);
    }

}
