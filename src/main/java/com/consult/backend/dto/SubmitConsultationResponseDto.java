package com.consult.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SubmitConsultationResponseDto {

    private Long consultationId;

    private String razorpayOrderId;

    private Integer amount;
}
