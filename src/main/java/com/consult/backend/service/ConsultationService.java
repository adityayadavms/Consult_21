package com.consult.backend.service;

import com.consult.backend.dto.SubmitConsultationRequestDto;
import com.consult.backend.dto.SubmitConsultationResponseDto;
import com.consult.backend.entity.Category;
import com.consult.backend.entity.ConsultationRequest;
import com.consult.backend.entity.Questions;
import com.consult.backend.entity.User;
import com.consult.backend.repository.*;

import lombok.AllArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;



@Service
@AllArgsConstructor
public class ConsultationService {
    private final ConsultationRequestRepository consultationRequestRepository;
    private final CategoryRepository categoryRepository;
    private final FormTemplateRepository formTemplateRepository;
    private final UserRepository userRepository;
    private final QuestionsRepository questionsRepository;

    /*
     =========================================
     SUBMIT CONSULTATION REQUEST
     =========================================
    */
    @Transactional
    public SubmitConsultationResponseDto submitConsultation(SubmitConsultationRequestDto dto) {

        // STEP 1 — USER
        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // STEP 2 — CATEGORY
        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Invalid category"));

        // STEP 3 — TEMPLATE VALIDATION
        formTemplateRepository.findByCategoryIdAndActiveTrue(dto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("No active template found"));

        // STEP 4 — EXTRACT QUESTION
        String questionText = (String) dto.getAnswers().get("question");

        if (questionText == null || questionText.trim().isEmpty()) {
            throw new RuntimeException("Question is required");
        }

        // STEP 5 — SAVE CONSULTATION
        ConsultationRequest consultation = ConsultationRequest.builder()
                .user(user)
                .category(category)
                .answersJson(dto.getAnswers())
                .amount(21)
                .build();

        consultationRequestRepository.save(consultation);

        // STEP 6 — SAVE QUESTION
        Questions question = Questions.builder()
                .question(questionText)
                .user(user)
                .build();

        questionsRepository.save(question);

        // STEP 7 — RESPONSE
        return SubmitConsultationResponseDto.builder()
                .consultationId(consultation.getId())
                .razorpayOrderId(null)
                .amount(21)
                .build();
    }
}
