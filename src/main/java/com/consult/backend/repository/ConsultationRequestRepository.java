package com.consult.backend.repository;

import com.consult.backend.entity.ConsultationRequest;
import com.consult.backend.entity.Entity.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ConsultationRequestRepository extends JpaRepository<ConsultationRequest,Long> {

    List<ConsultationRequest> findByUserId(Long userId);

    List<ConsultationRequest> findByPaymentStatus(PaymentStatus status);

    ConsultationRequest findByRazorpayOrderId(String razorpayOrderId);
}
