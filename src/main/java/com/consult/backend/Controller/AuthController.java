package com.consult.backend.Controller;

import com.consult.backend.Security.AuthService;
import com.consult.backend.dto.*;
import com.consult.backend.util.ResponseUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<ApiResponseDto<SignupResponseDto>> signup(
            @RequestBody SignupRequestDto dto
    ) {
        return ResponseUtil.success(
                authService.signup(dto),
                "User registered successfully"
        );
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponseDto<LoginResponseDto>> login(
            @RequestBody LoginRequestDto dto
    ) {
        return ResponseUtil.success(
                authService.login(dto),
                "Login successful"
        );
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponseDto<LoginResponseDto>> refresh(
            @RequestBody RefreshTokenRequestDto dto
    ) {
        return ResponseUtil.success(
                authService.refreshAccessToken(dto.getRefreshToken()),
                "Token refreshed successfully"
        );
    }


    @PostMapping("/logout")
    public ResponseEntity<ApiResponseDto<Void>> logout(
            @RequestBody LogoutRequestDto dto
    ) {
        authService.logout(dto.getAccessToken(), dto.getRefreshToken());

        return ResponseUtil.success(null, "Logout successful");
    }


    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponseDto<Void>> forgotPassword(
            @RequestBody ForgotPasswordRequestDto dto
    ) {
        authService.forgotPassword(dto.getEmail());

        return ResponseUtil.success(null, "OTP sent to email");
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponseDto<Void>> verifyOtp(
            @RequestBody VerifyOtpRequestDto dto
    ) {
        authService.verifyOtp(dto.getEmail(), dto.getOtp());

        return ResponseUtil.success(null, "OTP verified");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponseDto<Void>> resetPassword(
            @RequestBody ResetPasswordRequestDto dto
    ) {
        authService.resetPassword(dto.getEmail(), dto.getNewPassword());

        return ResponseUtil.success(null, "Password reset successful");
    }



}
