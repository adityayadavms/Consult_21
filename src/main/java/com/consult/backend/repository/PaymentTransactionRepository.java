package com.consult.backend.repository;
import com.consult.backend.entity.PaymentOrder;
import com.consult.backend.entity.PaymentTransaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PaymentTransactionRepository extends JpaRepository<PaymentTransaction,Long>{
    Optional<PaymentTransaction>  findByGatewayPaymentId(String gatewayPaymentId);

    Optional<PaymentTransaction> findTopByPaymentOrderOrderByCreatedAtDesc(PaymentOrder paymentOrder);
}
