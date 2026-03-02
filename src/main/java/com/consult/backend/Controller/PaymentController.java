package com.consult.backend.Controller;

import com.consult.backend.dto.CreateOrderRequestDto;
import com.consult.backend.dto.CreateOrderResponseDto;
import com.consult.backend.dto.PaymentVerificationRequestDto;
import com.consult.backend.dto.PaymentVerificationResponseDto;
import com.consult.backend.service.RazorPayService;

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
    public CreateOrderResponseDto createOrder(
            @RequestBody CreateOrderRequestDto dto
    ) {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        return razorpayService.createOrderForConsultation(
                dto.getConsultationId(),
                email
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
