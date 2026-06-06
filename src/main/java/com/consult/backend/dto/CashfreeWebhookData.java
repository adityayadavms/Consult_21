package com.consult.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CashfreeWebhookData {
    private CashfreeWebhookOrder order;

    private CashfreeWebhookPayment payment;

    @JsonProperty("customer_details")
    private CashfreeWebhookCustomer customerDetails;

    @JsonProperty("payment_gateway_details")
    private CashfreeGatewayDetails paymentGatewayDetails;

    @JsonProperty("error_details")
    private CashfreeWebhookErrorDetails errorDetails;
}
