package com.consult.backend.dto;


import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CashfreeOrderResponse {
    @JsonProperty("order_id")
    private String orderId;

    @JsonProperty("order_status")
    private String orderStatus;

    @JsonProperty("order_amount")
    private Double orderAmount;

    @JsonProperty("order_currency")
    private String orderCurrency;

    @JsonProperty("cf_order_id")
    private String cashfreeOrderId;

    @JsonProperty("payment_session_id")
    private String paymentSessionId;
}
