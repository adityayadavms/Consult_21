package com.consult.backend.service;

import com.consult.backend.dto.CreateOrderResponseDto;

import com.consult.backend.entity.ConsultationRequest;
import com.consult.backend.entity.Entity.PaymentStatus;
import com.consult.backend.entity.IdempotencyKey;
import com.consult.backend.entity.PaymentOrder;
import com.consult.backend.entity.Questions;

import com.consult.backend.repository.ConsultationRequestRepository;
import com.consult.backend.repository.PaymentOrderRepository;
import com.consult.backend.repository.QuestionsRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
;

import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RazorPayService {
    private final PaymentOrderRepository paymentOrderRepository;

    private final ConsultationRequestRepository consultationRequestRepository;

    private final EmailService emailService;

    private final QuestionsRepository questionsRepository;

    @Value("${cashfree.appid}")
    private String appId;

    @Value("${cashfree.secret_key}")
    private String secretKey;

    private final IdempotencyService idempotencyService;

    private final ObjectMapper objectMapper;

    /*
     =========================================
     CREATE RAZORPAY ORDER
     =========================================
    */
    @Transactional
    public CreateOrderResponseDto createOrderForConsultation(
            Long consultationId,
            String userEmail,
            String idempotencyKey
    ) {

        try {
               /*
            =========================================
            IDEMPOTENCY — BUILD REQUEST HASH
            =========================================
            */

            String payload =
                    consultationId + ":" + userEmail;

            String requestHash =
                    idempotencyService.generateRequestHash(
                            payload
                    );

                /*
                =========================================
                IDEMPOTENCY — LOOKUP KEY
                =========================================
                */

            Optional<IdempotencyKey> existingKey =
                    idempotencyService.findByKey(
                            idempotencyKey
                    );


            if (existingKey.isPresent()) {

                IdempotencyKey stored =
                        existingKey.get();

                /*
                =========================================
                SECURITY CHECK
                =========================================
                */

                if (
                        !idempotencyService.matchesRequest(
                                stored,
                                requestHash
                        )
                ) {

                    throw new RuntimeException(
                            "Idempotency key reused with different request"
                    );
                }

                /*
                =========================================
                RETURN STORED RESPONSE
                =========================================
                */

                return objectMapper.readValue(
                        stored.getResponseBody(),
                        CreateOrderResponseDto.class
                );
            }
            /*
            =========================================
            STEP 1 — Fetch Consultation
            =========================================
            */

            ConsultationRequest consultation =
                    consultationRequestRepository
                            .findById(consultationId)
                            .orElseThrow(
                                    () -> new RuntimeException(
                                            "Consultation not found"
                                    )
                            );

            /*
            =========================================
            STEP 2 — Validate Ownership
            =========================================
            */

            if (!consultation.getUser()
                    .getEmail()
                    .equals(userEmail)) {

                throw new RuntimeException(
                        "Unauthorized access to consultation"
                );
            }

            /*
            =========================================
            STEP 3 — Already Paid?
            =========================================
            */

            if (consultation.getPaymentStatus()
                    == PaymentStatus.PAID) {

                throw new RuntimeException(
                        "Consultation already paid"
                );
            }

            /*
            =========================================
            STEP 4 — Prevent duplicate orders
            =========================================
            */

            if (consultation.getPaymentOrder() != null) {

                throw new RuntimeException(
                        "Order already created for this consultation"
                );
            }

            /*
            =========================================
            STEP 5 — Create Gateway Order
            =========================================
            */

            JSONObject orderRequest =
                    new JSONObject();

            orderRequest.put(
                    "amount",
                    consultation.getAmount() * 100
            );

            orderRequest.put(
                    "currency",
                    "INR"
            );

            orderRequest.put(
                    "receipt",
                    "CONSULT_" +
                            consultation.getId()
            );

            Order order =
                    razorpayClient
                            .orders
                            .create(orderRequest);

            /*
            =========================================
            STEP 6 — Create PaymentOrder
            =========================================
            */

            PaymentOrder paymentOrder =
                    PaymentOrder.builder()

                            .orderId(
                                    "PAY_" + UUID.randomUUID()
                            )

                            .gatewayOrderId(
                                    order.get("id").toString()
                            )



                            .amount(
                                    BigDecimal.valueOf(
                                            consultation.getAmount()
                                    )
                            )

                            .currency("INR")

                            .status(
                                    PaymentStatus.PENDING
                            )

                            .consultationRequest(
                                    consultation
                            )

                            .build();

                    /*
                    =========================================
                    STEP 7 — Link both sides
                    =========================================
                    */

                    consultation.setPaymentOrder(
                            paymentOrder
                    );

                    /*
                    =========================================
                    STEP 8 — TEMPORARY
                    Keep legacy fields alive
                    =========================================
                    */

                    consultation.setPaymentStatus(
                            PaymentStatus.PENDING
                    );

                    consultation.setRazorpayOrderId(
                            order.get("id")
                    );

                /*
                =========================================
                STEP 9 — Save
                =========================================
                */

                    paymentOrderRepository.save(
                            paymentOrder
                    );

                    consultationRequestRepository.save(
                            consultation
                    );

                /*
                =========================================
                STEP 10 — BUILD RESPONSE
                =========================================
                */

                            CreateOrderResponseDto responseDto =
                                    CreateOrderResponseDto
                                            .builder()

                                            .orderId(
                                                    order.get("id").toString()
                                            )

                                            .amount(
                                                    order.get("amount")
                                            )

                                            .currency(
                                                    order.get("currency")
                                            )

                                            .razorpayKey(
                                                    key
                                            )

                                            .build();

                /*
                =========================================
                STEP 11 — STORE IDEMPOTENCY RESPONSE
                =========================================
                */

                            String responseBody =
                                    objectMapper.writeValueAsString(
                                            responseDto
                                    );

                            idempotencyService.saveResponse(
                                    idempotencyKey,
                                    requestHash,
                                    responseBody
                            );

                /*
                =========================================
                STEP 12 — RETURN RESPONSE
                =========================================
                */

                            return responseDto;
                        }

                        catch (Exception e) {

                            throw new RuntimeException(
                                    "Failed to create Razorpay order: "
                                            + e.getMessage(),
                                    e
                            );
                        }
                    }
    /*
     =========================================
     VERIFY PAYMENT SIGNATURE
     =========================================
    */
    public boolean verifySignature(
            String orderId,
            String paymentId,
            String signature
    ) {
        try {

            String payload = orderId + "|" + paymentId;
            String expectedSignature = Utils.getHash(payload, key);

            return expectedSignature.equals(signature);

        } catch (Exception e) {
            throw new RuntimeException("Signature verification failed");
        }
    }

    /*
     =========================================
     MARK CONSULTATION AS PAID
     =========================================
    */
    @Transactional
    public void verifyAndMarkPaymentSuccess(
            Long consultationId,
            String razorpayOrderId,
            String razorpayPaymentId,
            String razorpaySignature,
            String userEmail
    ) {

    /*
     =========================================
     STEP 1 — Fetch Consultation
     =========================================
    */
        ConsultationRequest consultation =
                consultationRequestRepository.findById(consultationId)
                        .orElseThrow(() -> new RuntimeException("Consultation not found"));

    /*
     =========================================
     STEP 2 — Ownership Validation
     =========================================
    */
        if (!consultation.getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException("Unauthorized access");
        }

    /*
     =========================================
     STEP 3 — Already Paid Protection
     =========================================
    */
        if (consultation.getPaymentStatus() == PaymentStatus.PAID) {
            throw new RuntimeException("Payment already completed");
        }

    /*
     =========================================
     STEP 4 — Order ID Match Validation
     =========================================
    */
        if (consultation.getRazorpayOrderId() == null ||
                !consultation.getRazorpayOrderId().equals(razorpayOrderId)) {
            throw new RuntimeException("Order ID mismatch");
        }

    /*
     =========================================
     STEP 5 — Signature Verification
     =========================================
    */
        boolean valid = verifySignature(
                razorpayOrderId,
                razorpayPaymentId,
                razorpaySignature
        );

        if (!valid) {
            throw new RuntimeException("Invalid payment signature");
        }

    /*
     =========================================
     STEP 6 — Mark Payment Success
     =========================================
    */
        consultation.setPaymentStatus(PaymentStatus.PAID);
        consultation.setRazorpayPaymentId(razorpayPaymentId);

        consultationRequestRepository.save(consultation);
        /*
     =========================================
     STEP 7 — Save Question
     =========================================
    */
        String questionText = extractQuestion(consultation);

        Questions question = Questions.builder()
                .question(questionText)
                .user(consultation.getUser())
                .consultation(consultation)
                .build();

        try {
            questionsRepository.save(question);
        } catch (Exception e) {
            //  This will happen if duplicate insert attempted
            System.out.println("Question already exists for this consultation");
        }


        /*
        =========================================
         Step 8 --  SEND EMAIL NOTIFICATIONS
        =========================================
        */

        emailService.sendPaymentSuccessNotification(consultation);
        emailService.sendUserConsultationConfirmation(consultation);
    }

    private String extractQuestion(ConsultationRequest consultation) {

        String questionText = null;

        // CASE 1: Quick Consultation
        if (consultation.getQuickQuestion() != null &&
                !consultation.getQuickQuestion().trim().isEmpty()) {

            questionText = consultation.getQuickQuestion();
        }

        // CASE 2: Proper Consultation (JSON)
        else if (consultation.getAnswersJson() != null) {

            for (Map.Entry<String, Object> entry : consultation.getAnswersJson().entrySet()) {

                if (entry.getKey() != null &&
                        entry.getKey().equalsIgnoreCase("question")) {

                    questionText = (String) entry.getValue();
                    break;
                }
            }
        }

        // FINAL VALIDATION
        if (questionText == null || questionText.trim().isEmpty()) {
            throw new RuntimeException("Question not found in consultation");
        }

        return questionText;
    }


}
