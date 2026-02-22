package com.consult.backend.dto;

import lombok.Data;

@Data
public class VerifyOtpRequestDto {
    private String email;
    private String otp;
}
