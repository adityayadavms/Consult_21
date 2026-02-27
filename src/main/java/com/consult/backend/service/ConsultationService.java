package com.consult.backend.service;

import com.consult.backend.dto.SubmitConsultationRequestDto;
import com.consult.backend.dto.SubmitConsultationResponseDto;
import com.consult.backend.entity.Category;
import com.consult.backend.entity.ConsultationRequest;
import com.consult.backend.entity.User;
import com.consult.backend.repository.CategoryRepository;
import com.consult.backend.repository.ConsultationRequestRepository;
import com.consult.backend.repository.FormTemplateRepository;
import com.consult.backend.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@AllArgsConstructor
public class ConsultationService {
    private final ConsultationRequestRepository consultationRequestRepository;
    private final CategoryRepository categoryRepository;
    private final FormTemplateRepository formTemplateRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    /*
     =========================================
     SUBMIT CONSULTATION REQUEST
     =========================================
    */
    @Transactional
    public SubmitConsultationResponseDto submitConsultation(SubmitConsultationRequestDto dto) {

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
        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Invalid category"));

        /*
         =========================================
         STEP 3 — VALIDATE TEMPLATE EXISTS
         =========================================
        */
        formTemplateRepository.findByCategoryIdAndActiveTrue(dto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("No active template found"));

        /*
         =========================================
         STEP 4 — CONVERT ANSWERS TO JSON STRING
         =========================================
        */
        String answersJson;
        try {
            answersJson = objectMapper.writeValueAsString(dto.getAnswers());
        } catch (Exception e) {
            throw new RuntimeException("Invalid answers format");
        }

        /*
         =========================================
         STEP 5 — CREATE ENTITY
         =========================================
        */
        ConsultationRequest consultation = ConsultationRequest.builder()
                .user(user)
                .category(category)
                .answersJson(answersJson)

                .createdAt(LocalDateTime.now())
                .build();

        /*
         =========================================
         STEP 6 — SAVE
         =========================================
        */
        consultationRequestRepository.save(consultation);

        /*
         =========================================
         STEP 7 — RETURN RESPONSE
         =========================================
        */
        return SubmitConsultationResponseDto.builder()
                .consultationId(consultation.getId())
                .razorpayOrderId(null)
                .amount(21)
                .build();
    }
}
