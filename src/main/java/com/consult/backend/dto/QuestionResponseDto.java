package com.consult.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class QuestionResponseDto {
    private Long id;
    private String question;
    private LocalDateTime askedAt;
}
