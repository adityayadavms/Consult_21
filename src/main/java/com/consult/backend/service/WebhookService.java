package com.consult.backend.service;

import com.consult.backend.dto.CashfreeWebhookDto;
import com.consult.backend.entity.ConsultationRequest;
import com.consult.backend.entity.PaymentOrder;
import com.consult.backend.entity.ProcessedWebhook;
import com.consult.backend.repository.PaymentOrderRepository;
import com.consult.backend.repository.ProcessedWebhookRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class WebhookService {
    private final ProcessedWebhookRepository processedWebhookRepository;
    private final PaymentOrderRepository paymentOrderRepository;
    private final PaymentService paymentService;

    private final ObjectMapper objectMapper;

    public boolean isProcessed(String webhookId) {

        return processedWebhookRepository.existsByWebhookId(webhookId);
    }

    @Transactional
    public void saveProcessedWebhook(String webhookId, String eventType, String payload) {

        ProcessedWebhook webhook =
                ProcessedWebhook.builder()

                        .webhookId(
                                webhookId
                        )

                        .eventType(
                                eventType
                        )

                        .payload(
                                payload
                        )

                        .processedAt(
                                LocalDateTime.now()
                        )

                        .build();

        processedWebhookRepository.save(webhook);
    }

    @Transactional
    public void processWebhook(String webhookId, String payload) throws Exception {

        if (isProcessed(webhookId)) {
            return;
        }



        CashfreeWebhookDto webhook = objectMapper.readValue(payload, CashfreeWebhookDto.class);


        String eventType = webhook.getType();

        switch (eventType) {
            case "PAYMENT_SUCCESS_WEBHOOK" -> {

                String orderId = webhook.getData()
                                .getOrder()
                                .getOrderId();

                String customerEmail = webhook.getData()
                                .getCustomerDetails()
                                .getCustomerEmail();

                String cfPaymentId = webhook.getData()
                                .getPayment()
                                .getPaymentId();

                PaymentOrder paymentOrder = paymentOrderRepository
                                .findByGatewayOrderId(orderId)
                                .orElseThrow(
                                        () -> new RuntimeException(
                                                "Payment order not found"
                                        )
                                );

                ConsultationRequest consultation = paymentOrder.getConsultationRequest();

                paymentService.verifyPayment(consultation.getId(), orderId, cfPaymentId, customerEmail);

                saveProcessedWebhook(
                        webhookId,
                        eventType,
                        payload
                );
            }

            case "PAYMENT_FAILED_WEBHOOK" -> {
                String orderId = webhook.getData()
                                .getOrder()
                                .getOrderId();

                String cfPaymentId = webhook.getData()
                                .getPayment()
                                .getPaymentId();

                String failureReason = webhook.getData()
                                .getErrorDetails()
                                .getErrorDescription();


                PaymentOrder paymentOrder = paymentOrderRepository
                                .findByGatewayOrderId(orderId)
                                .orElseThrow(
                                        () -> new RuntimeException(
                                                "Payment order not found"
                                        )
                                );

                ConsultationRequest consultation = paymentOrder.getConsultationRequest();

                paymentService.markPaymentFailed(consultation.getId(), orderId, cfPaymentId, failureReason);

                saveProcessedWebhook(webhookId, eventType, payload);
            }

            default -> {

                log.info("Ignoring Cashfree webhook event {}", eventType);

                saveProcessedWebhook(webhookId, eventType, payload);
            }

        }



    }
}
