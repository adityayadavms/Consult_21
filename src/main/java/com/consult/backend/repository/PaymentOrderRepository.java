package com.consult.backend.repository;
import com.consult.backend.entity.PaymentOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentOrderRepository extends JpaRepository<PaymentOrder,Long> {
    Optional<PaymentOrder> findByGatewayOrderId(String gatewayOrderId);

    Optional<PaymentOrder> findByOrderId(String orderId);
}
