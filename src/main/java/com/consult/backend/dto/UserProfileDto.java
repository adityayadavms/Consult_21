package com.consult.backend.dto;


import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserProfileDto {
    private Long id;
    private String name;
    private String email;
    private String phone;
}
