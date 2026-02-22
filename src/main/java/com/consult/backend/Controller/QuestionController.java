package com.consult.backend.Controller;

import com.consult.backend.dto.ApiResponseDto;
import com.consult.backend.dto.PaginatedQuestionsResponseDto;
import com.consult.backend.service.QuestionsService;
import com.consult.backend.util.ResponseUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.Authentication;


@RestController
@RequestMapping("/questions")
@RequiredArgsConstructor
public class QuestionController {
    private final QuestionsService questionsService;

    @GetMapping("/my")
    public ApiResponseDto<PaginatedQuestionsResponseDto> getMyQuestions(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {

        String email = authentication.getName();

        return ResponseUtil.success(
                questionsService.getMyQuestions(email, page, size),
                "Questions fetched successfully"
        ).getBody();
    }
}
