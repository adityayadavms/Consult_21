package com.consult.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class QuickConsultationRequestDto {

    private String name;
    private String emailOrPhone;
    private String category;
    private String question;
}
