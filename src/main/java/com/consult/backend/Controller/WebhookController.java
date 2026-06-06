package com.consult.backend.Controller;


import com.consult.backend.dto.CashfreeWebhookDto;
import com.consult.backend.service.CashfreeWebhookVerifier;

import com.consult.backend.service.WebhookService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/webhooks")
@RequiredArgsConstructor
public class WebhookController {


    private final WebhookService webhookService;

    private final CashfreeWebhookVerifier webhookVerifier;

    private final ObjectMapper objectMapper;

    @PostMapping("/cashfree")
    public ResponseEntity<String> handleCashfreeWebhook(

            @RequestHeader("x-webhook-signature")
            String signature,

            @RequestHeader("x-webhook-timestamp")
            String timestamp,

            @RequestBody
            String payload

    ) throws Exception {

        /*
        =========================================
        VERIFY SIGNATURE
        =========================================
        */

        boolean valid = webhookVerifier.verifySignature(payload, timestamp, signature);

        if (!valid) {

            return ResponseEntity
                    .status(403)
                    .body(
                            "Invalid webhook signature"
                    );
        }

        /*
        =========================================
        PARSE WEBHOOK
        =========================================
        */

        CashfreeWebhookDto webhook = objectMapper.readValue(payload, CashfreeWebhookDto.class);


        if (webhook.getData() == null || webhook.getData().getPayment() == null) {
            return ResponseEntity.ok("Webhook ignored");
        }

        /*
        =========================================
        EXTRACT PAYMENT ID
        =========================================
        */

        String webhookId = webhook.getType()
                        + ":"
                        + webhook.getData()
                        .getPayment()
                        .getPaymentId();

        /*
        =========================================
        PROCESS WEBHOOK
        =========================================
        */

        webhookService.processWebhook(webhookId, payload);

        return ResponseEntity.ok("Webhook processed successfully"
        );
    }

}
