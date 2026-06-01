package com.consult.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CashfreeCreateOrderRequest {
    @JsonProperty("order_id")
    private String orderId;

    @JsonProperty("order_amount")
    private Double orderAmount;

    @JsonProperty("order_currency")
    private String orderCurrency;

    @JsonProperty("customer_details")
    private CashfreeCustomerDetails customerDetails;
}
