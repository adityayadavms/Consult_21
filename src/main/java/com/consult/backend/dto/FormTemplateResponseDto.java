package com.consult.backend.dto;


import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class FormTemplateResponseDto {

    private Long categoryId;
    private String categoryName;
    private Object schemaJson;
}
