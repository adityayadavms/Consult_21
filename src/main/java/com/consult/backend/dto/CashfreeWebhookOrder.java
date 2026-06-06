package com.consult.backend.dto;


import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CashfreeWebhookOrder {
    @JsonProperty("order_id")
    private String orderId;

    @JsonProperty("order_amount")
    private Double orderAmount;

    @JsonProperty("order_currency")
    private String orderCurrency;
}
