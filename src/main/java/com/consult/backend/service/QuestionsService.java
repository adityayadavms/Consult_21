package com.consult.backend.service;

import com.consult.backend.dto.PaginatedQuestionsResponseDto;
import com.consult.backend.dto.QuestionResponseDto;
import com.consult.backend.entity.Questions;
import com.consult.backend.entity.User;
import com.consult.backend.repository.QuestionsRepository;
import com.consult.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@RequiredArgsConstructor
public class QuestionsService {
    private final QuestionsRepository questionsRepository;
    private final UserRepository userRepository;

    public PaginatedQuestionsResponseDto getMyQuestions(
            String email,
            int page,
            int size
    ) {

        // Get logged-in user
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Pageable pageable = PageRequest.of(page, size);

        Page<Questions> questionsPage =
                questionsRepository.findByUserOrderByAskedAtDesc(user, pageable);

        // Convert to DTO list
        List<QuestionResponseDto> content = questionsPage.getContent()
                .stream()
                .map(q -> QuestionResponseDto.builder()
                        .id(q.getId())
                        .question(q.getQuestion())
                        .askedAt(q.getAskedAt())
                        .build())
                .toList();

        return PaginatedQuestionsResponseDto.builder()
                .content(content)
                .pageNumber(questionsPage.getNumber())
                .pageSize(questionsPage.getSize())
                .totalElements(questionsPage.getTotalElements())
                .totalPages(questionsPage.getTotalPages())
                .last(questionsPage.isLast())
                .build();
    }
}
