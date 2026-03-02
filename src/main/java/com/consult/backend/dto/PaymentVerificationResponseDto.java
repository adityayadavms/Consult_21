package com.consult.backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PaymentVerificationResponseDto {

    private boolean success;
    private String message;
}
