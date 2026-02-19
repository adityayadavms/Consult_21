package com.consult.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponseDto {

    private String accessToken;
    private String refreshToken;

    private Long userId;
    private String email;
    private String role;
}
