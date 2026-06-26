package com.consult.backend.service;


import com.consult.backend.dto.CashfreeCreateOrderResponse;
import com.consult.backend.dto.CashfreeOrderResponse;
import com.consult.backend.dto.CreateOrderResponseDto;
import com.consult.backend.dto.PaymentStatusResponseDto;
import com.consult.backend.entity.*;
import com.consult.backend.entity.Entity.PaymentStatus;
import com.consult.backend.entity.Entity.TransactionStatus;
import com.consult.backend.repository.ConsultationRequestRepository;
import com.consult.backend.repository.PaymentOrderRepository;
import com.consult.backend.repository.PaymentTransactionRepository;
import com.consult.backend.repository.QuestionsRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {
    private final CashFreeService cashfreeService;

    private final PricingService pricingService;

    private final ConsultationRequestRepository consultationRequestRepository;

    private final PaymentOrderRepository paymentOrderRepository;

    private final PaymentTransactionRepository paymentTransactionRepository;

    private final QuestionsRepository questionsRepository;

    private final EmailService emailService;

    private final IdempotencyService idempotencyService;

    private final ObjectMapper objectMapper;

    private final InvoiceService invoiceService;

    @Transactional
    public CreateOrderResponseDto createOrderForConsultation(Long consultationId, String userEmail,
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
                        !idempotencyService.isDifferentRequest(
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

            ConsultationRequest consultation = consultationRequestRepository
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

            if (
                    consultation.getPaymentOrder() != null
                            &&
                            consultation.getPaymentOrder().getStatus()
                                    == PaymentStatus.PAID
            )
            {
                throw new RuntimeException(
                        "Consultation already paid"
                );
            }

            /*
            =========================================
            STEP 4 — Prevent duplicate orders
            =========================================
            */

            if (consultation.getPaymentOrder() != null)
            {
                throw new RuntimeException(
                        "Order already created for this consultation"
                );
            }

            /*
            =========================================
            STEP 5 — Create Gateway Order
            =========================================
            */

            String internalOrderId =
                    "PAY_" + UUID.randomUUID();

            Double amount =
                    pricingService.calculateAmount(
                            consultation
                    );
            // Get user's phone from consultation
            String customerPhone = consultation.getPhone(); // This now contains phone

           // Validate phone exists
            if (customerPhone == null || customerPhone.isEmpty()) {
                log.warn("Phone number missing for user: {}", consultation.getUser().getEmail());
                // You might want to throw an exception here
                throw new RuntimeException("Phone number is required for payment");
            }

            CashfreeCreateOrderResponse cashfreeResponse = cashfreeService.createOrder(
                    internalOrderId,
                    amount,
                    consultation.getUser().getEmail(),
                    consultation.getUser().getName(),
                    customerPhone  // Pass the phone number
            );

            /*
            =========================================
            STEP 6 — Create PaymentOrder
            =========================================
            */

            PaymentOrder paymentOrder =
                    PaymentOrder.builder()

                            .orderId(
                                    internalOrderId
                            )

                            .gatewayOrderId(
                                    cashfreeResponse.getOrderId()
                            )



                            .amount(
                                    BigDecimal.valueOf(
                                            amount
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


            PaymentTransaction transaction =
                    PaymentTransaction.builder()

                            .transactionId(
                                    "TXN_" + UUID.randomUUID()
                            )

                            .paymentOrder(
                                    paymentOrder
                            )

                            .status(
                                    TransactionStatus.INITIATED
                            )

                            .build();


            consultation.setPaymentOrder(
                    paymentOrder
            );

                /*
                =========================================
                STEP 9 — Save
                =========================================
                */

            paymentOrderRepository.save(
                    paymentOrder
            );

            paymentTransactionRepository.save(
                    transaction
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
                    CreateOrderResponseDto.builder()

                            .orderId(
                                    cashfreeResponse.getOrderId()
                            )

                            .paymentSessionId(
                                    cashfreeResponse.getPaymentSessionId()
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

    private PaymentStatus mapCashfreeStatus(
            String status
    ) {

        if (status == null) {
            return PaymentStatus.FAILED;
        }

        return switch (status.toUpperCase()) {

            case "PAID" ->
                    PaymentStatus.PAID;

            case "ACTIVE" ->
                    PaymentStatus.PROCESSING;

            case "EXPIRED" ->
                    PaymentStatus.FAILED;

            case "TERMINATED" ->
                    PaymentStatus.FAILED;

            default ->
                    PaymentStatus.PENDING;
        };
    }

    @Transactional
    public void verifyPayment(Long consultationId, String cashfreeOrderId,  String cashfreePaymentId, String userEmail){
        ConsultationRequest consultation = consultationRequestRepository
                        .findById(consultationId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Consultation not found"
                                )
                        );

        if (cashfreePaymentId == null || cashfreePaymentId.isBlank()) {
            throw new RuntimeException("Cashfree payment id missing");
        }


        if (!consultation.getUser()
                        .getEmail()
                        .equals(userEmail)
        ) {
            throw new RuntimeException(
                    "Unauthorized access"
            );
        }

        PaymentOrder paymentOrder = consultation.getPaymentOrder();

        if (paymentOrder == null) {
            throw new RuntimeException("Payment order not found");
        }

        if (!paymentOrder.getGatewayOrderId().equals(cashfreeOrderId)) {
            throw new RuntimeException(
                    "Order mismatch"
            );
        }
        CashfreeOrderResponse cashfreeResponse =
                cashfreeService.verifyOrder(
                        cashfreeOrderId
                );

        BigDecimal gatewayAmount = BigDecimal.valueOf(cashfreeResponse.getOrderAmount());

        if (
                gatewayAmount.compareTo(
                        paymentOrder.getAmount()
                ) != 0
        )
        {
            throw new RuntimeException(
                    "Amount mismatch"
            );
        }

        if (
                !"INR".equalsIgnoreCase(
                        cashfreeResponse.getOrderCurrency()
                )
        )
        {
            throw new RuntimeException(
                    "Invalid currency"
            );
        }

        String gatewayResponse;

        try {

            gatewayResponse = objectMapper.writeValueAsString(cashfreeResponse);

        }
        catch (Exception e) {

            throw new RuntimeException("Failed to serialize CashFree response", e);

        }

        PaymentStatus paymentStatus = mapCashfreeStatus(cashfreeResponse.getOrderStatus());



        PaymentTransaction transaction =
                paymentTransactionRepository
                        .findTopByPaymentOrderOrderByCreatedAtDesc(
                                paymentOrder
                        )
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Transaction not found"
                                )
                        );


        transaction.setStatus(

                paymentStatus == PaymentStatus.PAID

                        ?

                        TransactionStatus.SUCCESS

                        :

                        TransactionStatus.FAILED
        );

        transaction.setGatewayResponse(gatewayResponse);

        transaction.setGatewayPaymentId(cashfreePaymentId);

        paymentTransactionRepository.save(
                transaction
        );

        if (paymentOrder.getStatus() != paymentStatus) {

            paymentOrder.setStatus(
                    paymentStatus
            );

            paymentOrderRepository.save(
                    paymentOrder
            );
        }



        if (paymentStatus != PaymentStatus.PAID) {
            return;
        }

        Invoice invoice = invoiceService.generateInvoice(paymentOrder);

        String questionText = extractQuestion(consultation);


        if (!questionsRepository.existsByConsultation(consultation)) {

            Questions question =
                    Questions.builder()

                            .question(
                                    questionText
                            )

                            .user(
                                    consultation.getUser()
                            )

                            .consultation(
                                    consultation
                            )

                            .build();

            questionsRepository.save(
                    question
            );
        }
        else {

            log.info(
                    "Question already exists for consultation {}",
                    consultation.getId()
            );

        }

        emailService
                .sendPaymentSuccessNotification(
                        consultation, invoice
                );

        emailService
                .sendUserConsultationConfirmation(
                        consultation,
                        invoice
                );
    }


    private String extractQuestion(
            ConsultationRequest consultation
    ) {

    /*
    =========================================
    CASE 1 — QUICK CONSULTATION
    =========================================
    */

        if (
                consultation.getQuickQuestion() != null
                        &&
                        !consultation.getQuickQuestion()
                                .trim()
                                .isEmpty()
        ) {

            return consultation.getQuickQuestion()
                    .trim();
        }

    /*
    =========================================
    CASE 2 — FORM ANSWERS
    =========================================
    */

        if (
                consultation.getAnswersJson() == null
                        ||
                        consultation.getAnswersJson()
                                .isEmpty()
        ) {

            throw new RuntimeException(
                    "Question not found in consultation"
            );
        }

    /*
    =========================================
    PRIORITY KEYS
    =========================================
    */

        String[] preferredKeys = {

                "question",

                "consultationQuestion",

                "query",

                "problem"

        };

    /*
    =========================================
    SEARCH PRIORITY KEYS
    =========================================
    */

        for (String key : preferredKeys) {

            Object value =
                    consultation
                            .getAnswersJson()
                            .get(key);

            if (
                    value instanceof String
                            &&
                            !((String) value)
                                    .trim()
                                    .isEmpty()
            ) {

                return ((String) value)
                        .trim();
            }
        }

    /*
    =========================================
    FALLBACK
    FIRST NON EMPTY STRING
    =========================================
    */

        for (Object value: consultation.getAnswersJson().values()) {

            if (value instanceof String && !((String) value).trim().isEmpty()) {
                return ((String) value).trim();
            }
        }

    /*
    =========================================
    NOTHING FOUND
    =========================================
    */

        throw new RuntimeException(
                "Question not found in consultation"
        );
    }

    @Transactional
    public void markPaymentFailed(Long consultationId, String cashfreeOrderId, String cashfreePaymentId,
            String failureReason
    ) {
        ConsultationRequest consultation = consultationRequestRepository
                        .findById(consultationId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Consultation not found"
                                )
                        );

        PaymentOrder paymentOrder = consultation.getPaymentOrder();
        if (paymentOrder == null) {
            throw new RuntimeException("Payment order not found");
        }

        PaymentTransaction transaction = paymentTransactionRepository
                .findTopByPaymentOrderOrderByCreatedAtDesc(paymentOrder)
                        .orElseThrow(() -> new RuntimeException("Transaction not found"));


        if (!paymentOrder.getGatewayOrderId().equals(cashfreeOrderId)) {
            throw new RuntimeException("Order mismatch");
        }


        transaction.setStatus(
                TransactionStatus.FAILED
        );

        transaction.setGatewayPaymentId(
                cashfreePaymentId
        );

        transaction.setFailureReason(
                failureReason
        );

        paymentTransactionRepository.save(
                transaction
        );


        paymentOrder.setStatus(
                PaymentStatus.FAILED
        );

        paymentOrderRepository.save(
                paymentOrder
        );



    }


    /**
     * Get payment status by order ID
     * @param orderId - Internal order ID (PAY_xxx) or gateway order ID
     * @param userEmail - Current logged-in user email (for authorization)
     * @return PaymentStatusResponseDto with payment details
     */
    @Transactional(readOnly = true)
    public PaymentStatusResponseDto getPaymentStatus(String orderId, String userEmail) {

        // STEP 1: Find payment order by either internal ID or gateway ID
        PaymentOrder paymentOrder = paymentOrderRepository
                .findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Payment order not found"));

        // STEP 2: Authorize - user must own this payment
        ConsultationRequest consultation = paymentOrder.getConsultationRequest();

        if (!consultation.getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException("Unauthorized access to payment information");
        }

        // STEP 3: Get the latest transaction for failure reason (if any)
        PaymentTransaction latestTransaction = paymentTransactionRepository
                .findTopByPaymentOrderOrderByCreatedAtDesc(paymentOrder)
                .orElse(null);

        // STEP 4: Build and return response
        return PaymentStatusResponseDto.builder()
                .orderId(paymentOrder.getOrderId())
                .gatewayOrderId(paymentOrder.getGatewayOrderId())
                .status(paymentOrder.getStatus().name())
                .amount(paymentOrder.getAmount().doubleValue())
                .currency(paymentOrder.getCurrency())
                .consultationId(consultation.getId())
                .isPaid(paymentOrder.getStatus() == PaymentStatus.PAID)
                .paidAt(getPaidAtTimestamp(paymentOrder, latestTransaction))
                .failureReason(latestTransaction != null ? latestTransaction.getFailureReason() : null)
                .build();
    }

    /**
     * Helper method to get the timestamp when payment was marked as PAID
     */
    private String getPaidAtTimestamp(PaymentOrder paymentOrder, PaymentTransaction latestTransaction) {
        if (paymentOrder.getStatus() != PaymentStatus.PAID) {
            return null;
        }

        // Return transaction creation time if available
        if (latestTransaction != null && latestTransaction.getCreatedAt() != null) {
            return latestTransaction.getCreatedAt().toString();
        }

        // Fallback to payment order update time
        if (paymentOrder.getUpdatedAt() != null) {
            return paymentOrder.getUpdatedAt().toString();
        }

        return null;
    }


}
