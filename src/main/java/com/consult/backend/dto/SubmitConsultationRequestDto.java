package com.consult.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SubmitConsultationRequestDto {

    private Long categoryId;

    private Map<String,Object> answers;
}
