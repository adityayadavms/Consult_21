package com.consult.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CashfreeGatewayDetails {
    @JsonProperty("gateway_name")
    private String gatewayName;

    @JsonProperty("gateway_order_id")
    private String gatewayOrderId;

    @JsonProperty("gateway_payment_id")
    private String gatewayPaymentId;
}
