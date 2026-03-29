package com.consult.backend.service;

import com.consult.backend.dto.CreateOrderResponseDto;
import com.consult.backend.dto.QuickConsultationRequestDto;
import com.consult.backend.dto.QuickConsultationResponseDto;
import com.consult.backend.entity.Category;
import com.consult.backend.entity.ConsultationRequest;
import com.consult.backend.entity.User;
import com.consult.backend.repository.CategoryRepository;
import com.consult.backend.repository.ConsultationRequestRepository;
import com.consult.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class QuickConsultationService {
    private final ConsultationRequestRepository consultationRequestRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final RazorPayService razorpayService;

    public QuickConsultationResponseDto createOrder(QuickConsultationRequestDto dto) {

        /*
         =========================================
         STEP 1 — GET LOGGED-IN USER
         =========================================
        */
        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        /*
         =========================================
         STEP 2 — VALIDATE CATEGORY
         =========================================
        */
        Category category = categoryRepository.findByName(dto.getCategory())
                .orElseThrow(() -> new RuntimeException("Invalid category"));

        /*
         =========================================
         STEP 3 — VALIDATE QUESTION
         =========================================
        */
        if (dto.getQuestion() == null || dto.getQuestion().trim().isEmpty()) {
            throw new RuntimeException("Question is required");
        }

        /*
         =========================================
         STEP 4 — CREATE CONSULTATION
         =========================================
        */
        ConsultationRequest consultation = ConsultationRequest.builder()
                .user(user)
                .category(category)
                .quickQuestion(dto.getQuestion())
                .contactInfo(dto.getEmailOrPhone())
                .name(dto.getName())
                .amount(21)
                .build();

        consultationRequestRepository.save(consultation);

        /*
         =========================================
         STEP 5 — CREATE RAZORPAY ORDER
         =========================================
        */
        CreateOrderResponseDto order =
                razorpayService.createOrderForConsultation(
                        consultation.getId(),
                        user.getEmail()
                );

        /*
         =========================================
         STEP 6 — RETURN RESPONSE
         =========================================
        */
        return QuickConsultationResponseDto.builder()
                .consultationId(consultation.getId())
                .razorpayOrderId(order.getOrderId())
                .amount(21)
                .build();
    }
}
