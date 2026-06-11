package com.consult.backend.service;

import com.consult.backend.dto.QuickConsultationRequestDto;
import com.consult.backend.dto.QuickConsultationResponseDto;
import com.consult.backend.entity.Category;
import com.consult.backend.entity.ConsultationRequest;
import com.consult.backend.entity.User;
import com.consult.backend.repository.CategoryRepository;
import com.consult.backend.repository.ConsultationRequestRepository;
import com.consult.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.HashMap;

@Service
@RequiredArgsConstructor
@Slf4j  // Make sure this annotation is present
public class QuickConsultationService {
    private final ConsultationRequestRepository consultationRequestRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    public QuickConsultationResponseDto createOrder(QuickConsultationRequestDto dto) {
        try {


            // STEP 1 — GET LOGGED-IN USER
            String email = SecurityContextHolder
                    .getContext()
                    .getAuthentication()
                    .getName();


            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));


            // STEP 2 — VALIDATE CATEGORY BY ID
            Category category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Invalid category ID: " + dto.getCategoryId()));

            // STEP 3 — VALIDATE QUESTION
            if (dto.getQuestion() == null || dto.getQuestion().trim().isEmpty()) {
                throw new RuntimeException("Question is required");
            }

            if (dto.getPhone() == null || dto.getPhone().trim().isEmpty()) {
                throw new RuntimeException("Phone number is required");
            }

            // STEP 4 — CREATE CONSULTATION
            ConsultationRequest consultation = ConsultationRequest.builder()
                    .user(user)
                    .category(category)
                    .quickQuestion(dto.getQuestion())
                    .contactInfo(dto.getPhone())
                    .name(dto.getName())
                    .answersJson(new HashMap<>())  // Empty map instead of null
                    .build();


            ConsultationRequest saved = consultationRequestRepository.save(consultation);



            // STEP 5 — RETURN RESPONSE
            return QuickConsultationResponseDto.builder()
                    .consultationId(saved.getId())
                    .message("Quick consultation submitted successfully")
                    .build();

        } catch (Exception e) {
            log.error("ERROR in createOrder: ", e);
            throw new RuntimeException("Failed to create consultation: " + e.getMessage(), e);
        }
    }
}