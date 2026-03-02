package com.consult.backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CreateOrderResponseDto {

    private String orderId;
    private Integer amount;
    private String currency;
    private String razorpayKey;
}
