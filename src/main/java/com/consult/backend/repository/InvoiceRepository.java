package com.consult.backend.repository;
import com.consult.backend.entity.Invoice;
import com.consult.backend.entity.PaymentOrder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface InvoiceRepository extends JpaRepository<Invoice,Long> {

    Optional<Invoice> findTopByOrderByIdDesc();

    Optional<Invoice> findByPaymentOrder(PaymentOrder paymentOrder);

    Optional<Invoice> findByInvoiceNumber(String invoiceNumber);
}
