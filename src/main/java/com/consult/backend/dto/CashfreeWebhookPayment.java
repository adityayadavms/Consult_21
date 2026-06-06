package com.consult.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CashfreeWebhookPayment {

    @JsonProperty("cf_payment_id")
    private String paymentId;

    @JsonProperty("payment_status")
    private String paymentStatus;

    @JsonProperty("payment_amount")
    private Double paymentAmount;

    @JsonProperty("payment_currency")
    private String paymentCurrency;

    @JsonProperty("payment_message")
    private String paymentMessage;
}
