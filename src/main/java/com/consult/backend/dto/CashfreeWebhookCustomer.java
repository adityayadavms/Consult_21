package com.consult.backend.dto;


import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class CashfreeWebhookCustomer {


    @JsonProperty("customer_email")
    private String customerEmail;

    @JsonProperty("customer_name")
    private String customerName;

    @JsonProperty("customer_id")
    private String customerId;
}
