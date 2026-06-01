package com.consult.backend.Controller;

import com.consult.backend.dto.*;
import com.consult.backend.service.RazorPayService;
import org.springframework.http.ResponseEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
public class PaymentController {
    private final RazorPayService razorpayService;

    /*
     =========================================
     CREATE RAZORPAY ORDER
     =========================================
    */
    @PostMapping("/create-order")
    public ResponseEntity<ApiResponseDto<CreateOrderResponseDto>> createOrder(
            @RequestHeader("Idempotency-Key")
            String idempotencyKey,   @RequestBody CreateOrderRequestDto dto
    ) {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        return razorpayService.createOrderForConsultation(
                dto.getConsultationId(),
                email,
                idempotencyKey
        );
    }

    /*
     =========================================
     VERIFY RAZORPAY PAYMENT
     =========================================
    */
    @PostMapping("/verify")
    public PaymentVerificationResponseDto verifyPayment(
            @RequestBody PaymentVerificationRequestDto dto
    ) {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        razorpayService.verifyAndMarkPaymentSuccess(
                dto.getConsultationId(),
                dto.getRazorpayOrderId(),
                dto.getRazorpayPaymentId(),
                dto.getRazorpaySignature(),
                email
        );

        return PaymentVerificationResponseDto.builder()
                .success(true)
                .message("Payment verified successfully")
                .build();
    }
}
