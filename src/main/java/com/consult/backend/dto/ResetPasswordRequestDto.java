package com.consult.backend.dto;

import lombok.Data;

@Data
public class ResetPasswordRequestDto {
       private String email;
       private String newPassword;
}
