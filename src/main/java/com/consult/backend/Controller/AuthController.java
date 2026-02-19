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
    public ResponseEntity<ApiResponseDto<String>> refresh(
            @RequestBody RefreshTokenRequestDto dto
    ) {
        return ResponseUtil.success(
                authService.refreshAccessToken(dto.getRefreshToken()),
                "Access token refreshed"
        );
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponseDto<Void>> logout(
            @RequestBody LogoutRequestDto dto
    ) {
        authService.logout(dto.getRefreshToken());

        return ResponseUtil.success(
                null,
                "Logout successful"
        );
    }

    @GetMapping("/test")
    public String test() {
        return "Protected API Working";
    }

}
