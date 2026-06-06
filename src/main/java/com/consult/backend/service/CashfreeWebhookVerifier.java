package com.consult.backend.service;


import com.consult.backend.Configuration.CashFreeConfig;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

@Service
@RequiredArgsConstructor
public class CashfreeWebhookVerifier {
    private final CashFreeConfig cashfreeConfig;

    public boolean verifySignature(
            String payload,
            String timestamp,
            String receivedSignature
    ) {

        try {

            String data =
                    timestamp + payload;

            Mac mac =
                    Mac.getInstance(
                            "HmacSHA256"
                    );

            SecretKeySpec secretKeySpec =
                    new SecretKeySpec(
                            cashfreeConfig
                                    .getSecretKey()
                                    .getBytes(),
                            "HmacSHA256"
                    );

            mac.init(secretKeySpec);

            String generatedSignature =
                    Base64.getEncoder()
                            .encodeToString(
                                    mac.doFinal(
                                            data.getBytes()
                                    )
                            );

            return generatedSignature.equals(
                    receivedSignature
            );

        }

        catch (Exception e) {

            throw new RuntimeException(
                    "Webhook signature verification failed",
                    e
            );
        }
    }
}
