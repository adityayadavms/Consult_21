package com.consult.backend.service;

import com.consult.backend.dto.CreateOrderResponseDto;

import com.consult.backend.entity.ConsultationRequest;
import com.consult.backend.entity.Entity.PaymentStatus;
import com.consult.backend.entity.Questions;
import com.consult.backend.entity.User;
import com.consult.backend.repository.ConsultationRequestRepository;
import com.consult.backend.repository.QuestionsRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;

import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class RazorPayService {
    private final RazorpayClient razorpayClient;
    private final ConsultationRequestRepository consultationRequestRepository;
    private final EmailService emailService;
    private final QuestionsRepository questionsRepository;

    @Value("${razorpay.key}")
    private String key;

    /*
     =========================================
     CREATE RAZORPAY ORDER
     =========================================
    */
    @Transactional
    public CreateOrderResponseDto createOrderForConsultation(
            Long consultationId,
            String userEmail
    ) {

        try {

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
         STEP 2 — Validate Ownership
         =========================================
        */
            if (!consultation.getUser().getEmail().equals(userEmail)) {
                throw new RuntimeException("Unauthorized access to consultation");
            }

        /*
         =========================================
         STEP 3 — Check Already Paid
         =========================================
        */
            if (consultation.getPaymentStatus() == PaymentStatus.PAID) {
                throw new RuntimeException("Consultation already paid");
            }

        /*
         =========================================
         STEP 4 — Prevent Duplicate Order Creation
         =========================================
        */
            if (consultation.getRazorpayOrderId() != null) {
                throw new RuntimeException("Order already created for this consultation");
            }

        /*
         =========================================
         STEP 5 — Create Razorpay Order
         =========================================
        */
            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", consultation.getAmount() * 100); // rupees → paise
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "CONSULT_" + consultation.getId());

            Order order = razorpayClient.orders.create(orderRequest);

        /*
         =========================================
         STEP 6 — Save Order ID in DB
         =========================================
        */
            consultation.setRazorpayOrderId(order.get("id"));
            consultationRequestRepository.save(consultation);

        /*
         =========================================
         STEP 7 — Return Response
         =========================================
        */
            return CreateOrderResponseDto.builder()
                    .orderId(order.get("id"))
                    .amount(order.get("amount"))
                    .currency(order.get("currency"))
                    .razorpayKey(key) // inject key in class
                    .build();

        } catch (Exception e) {
            throw new RuntimeException("Failed to create Razorpay order: " + e.getMessage(), e);
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

        if (!isDuplicateQuestion(consultation.getUser(), questionText)) {

            Questions question = Questions.builder()
                    .question(questionText)
                    .user(consultation.getUser())
                    .build();

            questionsRepository.save(question);
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

    private boolean isDuplicateQuestion(User user, String questionText) {
        return questionsRepository
                .findByUserOrderByAskedAtDesc(user, PageRequest.of(0,1))
                .stream()
                .anyMatch(q -> q.getQuestion().equals(questionText));
    }
}
