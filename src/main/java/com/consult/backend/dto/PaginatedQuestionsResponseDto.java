package com.consult.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class PaginatedQuestionsResponseDto {
    private List<QuestionResponseDto> content;

    private int pageNumber;
    private int pageSize;

    private long totalElements;
    private int totalPages;

    private boolean last;
}
