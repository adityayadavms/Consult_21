package com.consult.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CashfreeCreateOrderResponse {
    @JsonProperty("order_id")
    private String orderId;

    @JsonProperty("payment_session_id")
    private String paymentSessionId;

    @JsonProperty("order_status")
    private String orderStatus;
}
