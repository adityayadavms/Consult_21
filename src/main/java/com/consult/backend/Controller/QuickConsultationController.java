package com.consult.backend.Controller;


import com.consult.backend.dto.QuickConsultationRequestDto;
import com.consult.backend.dto.QuickConsultationResponseDto;
import com.consult.backend.service.QuickConsultationService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/quick-consultation")
@AllArgsConstructor
public class QuickConsultationController {

    private final QuickConsultationService quickConsultationService;

    @PostMapping("/create-order")
    public QuickConsultationResponseDto createOrder(
            @RequestBody QuickConsultationRequestDto dto
    ) {
        return quickConsultationService.createOrder(dto);
    }
}
