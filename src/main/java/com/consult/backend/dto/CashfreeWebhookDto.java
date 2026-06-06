package com.consult.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CashfreeWebhookDto {
    private String type;

    @JsonProperty("event_time")
    private String eventTime;

    private CashfreeWebhookData data;
}
