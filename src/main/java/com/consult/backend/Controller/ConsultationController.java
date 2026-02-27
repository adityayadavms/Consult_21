package com.consult.backend.Controller;

import com.consult.backend.dto.SubmitConsultationRequestDto;
import com.consult.backend.dto.SubmitConsultationResponseDto;
import com.consult.backend.service.ConsultationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/consultations")
@RequiredArgsConstructor
public class ConsultationController {
    private final ConsultationService consultationService;

    /*
     =========================================
     SUBMIT CONSULTATION
     =========================================
    */
    @PostMapping
    public SubmitConsultationResponseDto submitConsultation(
            @RequestBody SubmitConsultationRequestDto requestDto
    ) {
        return consultationService.submitConsultation(requestDto);
    }
}
