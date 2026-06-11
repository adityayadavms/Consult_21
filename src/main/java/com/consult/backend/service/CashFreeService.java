package com.consult.backend.service;

import com.consult.backend.dto.CashfreeCreateOrderRequest;
import com.consult.backend.dto.CashfreeCreateOrderResponse;
import com.consult.backend.dto.CashfreeCustomerDetails;
import com.consult.backend.dto.CashfreeOrderResponse;

import com.consult.backend.exception.CashFreeException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import com.consult.backend.Configuration.CashFreeConfig;



@Service
@RequiredArgsConstructor
@Slf4j
public class CashFreeService {

    private static final String API_VERSION = "2025-01-01";

    private final WebClient cashfreeWebClient;

    private final CashFreeConfig cashfreeConfig;

    private final ObjectMapper objectMapper;

    private String sanitizeCustomerId(String email) {
        if (email == null) return null;
        // Replace @ with _at_ and . with _
        return email
                .replace("@", "_at_")
                .replace(".", "_");
    }

    public CashfreeCreateOrderResponse createOrder(String internalOrderId, Double amount,
            String customerEmail,
            String customerName, String customerPhone
    ) {

        String customerId = sanitizeCustomerId(customerEmail);


        CashfreeCreateOrderRequest request =
                CashfreeCreateOrderRequest.builder()

                        .orderId(internalOrderId)

                        .orderAmount(amount)

                        .orderCurrency("INR")

                        .customerDetails(CashfreeCustomerDetails
                                        .builder()
                                        .customerId(customerId)
                                        .customerName(customerName)
                                        .customerPhone(customerPhone)
                                        .build()
                        )

                        .build();

        try {
            log.info("Cashfree Create Order Request: {}", objectMapper.writeValueAsString(request));
        } catch (Exception e) {
            log.error("Failed to serialize request: {}", e.getMessage());
            log.info("Cashfree Create Order Request: (serialization failed)");
        }

        return cashfreeWebClient

                .post()
                .uri("/orders")
                .header("x-client-id", cashfreeConfig.getAppId())
                .header("x-client-secret", cashfreeConfig.getSecretKey())
                .header("x-api-version", API_VERSION)
                .bodyValue(request)
                .retrieve()
                .onStatus(
                        HttpStatusCode::is4xxClientError,
                        response ->
                                response.bodyToMono(String.class)
                                        .map(body ->
                                                new CashFreeException(
                                                        "CashFree Client Error: "
                                                                + body
                                                )
                                        )
                )

                .bodyToMono(CashfreeCreateOrderResponse.class)
                .block();
    }

    public CashfreeOrderResponse getOrder(String cashfreeOrderId) {

        return cashfreeWebClient

                .get()
                .uri("/orders/{orderId}", cashfreeOrderId)
                .header("x-client-id", cashfreeConfig.getAppId())
                .header("x-client-secret", cashfreeConfig.getSecretKey())
                .header("x-api-version", API_VERSION)
                .retrieve()
                .onStatus(
                        HttpStatusCode::is4xxClientError,
                        response -> response.bodyToMono(String.class).map(body ->
                                                new CashFreeException(
                                                        "Cashfree Server Error: "
                                                                + body
                                                )
                                        )
                )
                .bodyToMono(CashfreeOrderResponse.class)
                .block();
    }


    public CashfreeOrderResponse verifyOrder(
            String orderId
    ) {

        CashfreeOrderResponse response =
                getOrder(orderId);

        if (response == null) {

            throw new CashFreeException(
                    "Order not found in CashFree"
            );
        }

        return response;
    }


}
