package com.consult.backend.entity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor

@Table(
        name="invoices"
)
public class Invoice {
    @Id
    @GeneratedValue(
            strategy = GenerationType.IDENTITY
    )
    private Long id;

    @Column(
            nullable=false,
            unique=true
    )
    private String invoiceNumber;

    @OneToOne
    @JoinColumn(
            name="payment_order_id",
            nullable=false
    )
    private PaymentOrder paymentOrder;

    private String pdfUrl;

    private LocalDateTime generatedAt;

    @Column(nullable = false)
    private String customerEmail;

    @Column(nullable = false)
    private BigDecimal amount;

    @Column(nullable = false)
    private String currency;
}
