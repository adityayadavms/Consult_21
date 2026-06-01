package com.consult.backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CreateOrderResponseDto {

    /*
    ========================================
    INTERNAL ORDER ID
    ========================================
    */
    private String orderId;

    /*
    ========================================
    CASHFREE SESSION
    ========================================
    */
    private String paymentSessionId;
}
