package com.consult.backend.Controller;


import com.consult.backend.dto.ApiResponseDto;
import com.consult.backend.dto.QuickConsultationRequestDto;
import com.consult.backend.dto.QuickConsultationResponseDto;
import com.consult.backend.service.QuickConsultationService;
import com.consult.backend.util.ResponseUtil;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<ApiResponseDto<QuickConsultationResponseDto>> createOrder(
            @RequestBody QuickConsultationRequestDto dto
    ) {
        return ResponseUtil.success(quickConsultationService.createOrder(dto),"Quick Consultation Created");
    }
}
