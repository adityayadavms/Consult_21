package com.consult.backend.dto;

import lombok.Data;

@Data
public class PaymentVerificationRequestDto {
    private Long consultationId;

    private String razorpayOrderId;
    private String razorpayPaymentId;
    private String razorpaySignature;
}
