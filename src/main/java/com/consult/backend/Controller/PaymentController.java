package com.consult.backend.Controller;

import com.consult.backend.dto.*;
import com.consult.backend.service.PaymentService;

import com.consult.backend.util.ResponseUtil;
import org.springframework.http.ResponseEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
public class PaymentController {
    private final PaymentService paymentService;

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

        CreateOrderResponseDto response =
                paymentService.createOrderForConsultation(
                        dto.getConsultationId(),
                        email,
                        idempotencyKey
                );

        return ResponseUtil.success(
                response,
                "Order created successfully"
        );
    }


}
