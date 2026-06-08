package com.consult.backend.dto;


import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PaymentStatusResponseDto {
    /**
     * Internal order ID (PAY_xxx)
     */
    private String orderId;

    /**
     * Cashfree gateway order ID
     */
    private String gatewayOrderId;

    /**
     * Payment status: PENDING, PROCESSING, PAID, FAILED
     */
    private String status;

    /**
     * Amount paid (if status is PAID)
     */
    private Double amount;

    /**
     * Currency (INR)
     */
    private String currency;

    /**
     * Consultation ID associated with this payment
     */
    private Long consultationId;

    /**
     * Whether payment was successful
     */
    private boolean isPaid;

    /**
     * Timestamp when payment was completed (if PAID)
     */
    private String paidAt;

    /**
     * Failure reason (if status is FAILED)
     */
    private String failureReason;
}
