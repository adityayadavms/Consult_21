package com.consult.backend.Controller;

import com.consult.backend.dto.*;
import com.consult.backend.service.UserService;
import com.consult.backend.util.ResponseUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    // ============================
    // GET PROFILE
    // ============================
    @GetMapping("/me")
    public ResponseEntity<ApiResponseDto<UserProfileDto>> getProfile() {
        return ResponseUtil.success(
                userService.getCurrentUser(),
                "User profile fetched"
        );
    }

    // ============================
    // UPDATE NAME
    // ============================
    @PutMapping("/update-profile")
    public ResponseEntity<ApiResponseDto<UserProfileDto>> updateProfile(
            @RequestBody UpdateProfileRequestDto dto
    ) {
        return ResponseUtil.success(
                userService.updateProfile(dto),
                "Profile updated"
        );
    }

    // ============================
    // REQUEST PHONE UPDATE
    // ============================
    @PostMapping("/request-phone-update")
    public ResponseEntity<ApiResponseDto<Void>> requestPhoneUpdate(
            @RequestBody RequestPhoneUpdateDto dto
    ) {
        userService.requestPhoneUpdate(dto.getPhone());

        return ResponseUtil.success(null, "OTP sent successfully");
    }

    // ============================
    // VERIFY PHONE UPDATE
    // ============================
    @PostMapping("/verify-phone-update")
    public ResponseEntity<ApiResponseDto<UserProfileDto>> verifyPhoneUpdate(
            @RequestBody VerifyPhoneUpdateDto dto
    ) {
        return ResponseUtil.success(
                userService.verifyPhoneUpdate(dto.getOtp()),
                "Phone updated successfully"
        );
    }


    @PostMapping("/resend-phone-otp")
    public ResponseEntity<ApiResponseDto<Void>> resendPhoneOtp() {

        userService.resendPhoneOtp();

        return ResponseUtil.success(null, "OTP resent successfully");
    }
}
