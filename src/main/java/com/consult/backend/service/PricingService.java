package com.consult.backend.service;

import com.consult.backend.entity.ConsultationRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PricingService {
    public Double calculateAmount(
            ConsultationRequest consultation
    ) {

        /*
        Quick Consultation
        */

        if (
                consultation.getQuickQuestion() != null
                        &&
                        !consultation.getQuickQuestion().isBlank()
        ) {
            return 21.0;
        }

        /*
        Proper Consultation
        */

        return 49.0;
    }
}
