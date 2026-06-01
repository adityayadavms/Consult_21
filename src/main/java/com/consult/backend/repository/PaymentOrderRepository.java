package com.consult.backend.repository;
import com.consult.backend.entity.PaymentOrder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface PaymentOrderRepository extends JpaRepository<PaymentOrder,Long> {
    Optional<PaymentOrder> findByOrderId(String gatewayOrderId);
}
