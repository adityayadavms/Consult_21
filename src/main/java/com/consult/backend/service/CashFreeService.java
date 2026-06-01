package com.consult.backend.service;

import com.consult.backend.dto.CashfreeCreateOrderRequest;
import com.consult.backend.dto.CashfreeCreateOrderResponse;
import com.consult.backend.dto.CashfreeCustomerDetails;
import com.consult.backend.dto.CashfreeOrderResponse;
import com.consult.backend.entity.Entity.PaymentStatus;
import com.consult.backend.exception.CashFreeException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import com.consult.backend.Configuration.CashFreeConfig;

import static org.apache.logging.log4j.util.ProviderActivator.API_VERSION;

@Service
@RequiredArgsConstructor
public class CashFreeService {
    private final WebClient cashfreeWebClient;

    private final CashFreeConfig cashfreeConfig;


    public CashfreeCreateOrderResponse createOrder(String internalOrderId, Double amount,
            String customerEmail,
            String customerName
    ) {

        CashfreeCreateOrderRequest request =
                CashfreeCreateOrderRequest.builder()

                        .orderId(internalOrderId)

                        .orderAmount(amount)

                        .orderCurrency("INR")

                        .customerDetails(

                                CashfreeCustomerDetails
                                        .builder()

                                        .customerId(
                                                customerEmail
                                        )

                                        .customerName(
                                                customerName
                                        )

                                        .customerEmail(
                                                customerEmail
                                        )

                                        .build()

                        )

                        .build();

        return cashfreeWebClient

                .post()

                .uri("/orders")

                .header(
                        "x-client-id",
                        cashfreeConfig.getAppId()
                )

                .header(
                        "x-client-secret",
                        cashfreeConfig.getSecretKey()
                )

                .header(
                        "x-api-version",
                        API_VERSION
                )

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

                .bodyToMono(
                        CashfreeCreateOrderResponse.class
                )

                .block();
    }

    public CashfreeOrderResponse getOrder(String cashfreeOrderId) {

        return cashfreeWebClient

                .get()

                .uri("/orders/{orderId}",
                        cashfreeOrderId)

                .header(
                        "x-client-id",
                        cashfreeConfig.getAppId()
                )

                .header(
                        "x-client-secret",
                        cashfreeConfig.getSecretKey()
                )

                .header(
                        "x-api-version",
                        API_VERSION
                )

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

                .bodyToMono(
                        CashfreeOrderResponse.class
                )

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
