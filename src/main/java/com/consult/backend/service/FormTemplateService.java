package com.consult.backend.service;

import com.consult.backend.dto.FormTemplateResponseDto;
import com.consult.backend.entity.FormTemplate;
import com.consult.backend.repository.FormTemplateRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class FormTemplateService {

    private final FormTemplateRepository formTemplateRepository;

    @Transactional(readOnly = true)
    public FormTemplateResponseDto getTemplateByCategory(Long categoryId) {

        FormTemplate template = formTemplateRepository
                .findByCategoryIdAndActiveTrue(categoryId)
                .orElseThrow(() -> new RuntimeException("Template not found"));

        Object schemaObject;

        try {
            schemaObject = new ObjectMapper()
                    .readValue(template.getSchemaJson(), Object.class);
        } catch (Exception e) {
            throw new RuntimeException("Invalid JSON schema");
        }

        return  FormTemplateResponseDto.builder()
                .categoryId(template.getCategory().getId())
                .categoryName(template.getCategory().getName())
                .schemaJson(schemaObject)
                .build();

    }
}
