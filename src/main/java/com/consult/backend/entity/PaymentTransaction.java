package com.consult.backend.entity;
import com.consult.backend.entity.Entity.TransactionStatus;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@EntityListeners(AuditingEntityListener.class)

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor

@Table(
        name = "payment_transactions",
        indexes = {

                @Index(
                        name="idx_transaction_id",
                        columnList="transactionId"
                )
        }
)

public class PaymentTransaction {
    @Id
    @GeneratedValue(
            strategy = GenerationType.IDENTITY
    )
    private Long id;

    @Column(
            nullable=false,
            unique=true
    )
    private String transactionId;

    @ManyToOne(
            fetch = FetchType.LAZY
    )
    @JoinColumn(
            name="payment_order_id",
            nullable=false
    )
    private PaymentOrder paymentOrder;

    @Column
    private String gatewayPaymentId;

    @Enumerated(
            EnumType.STRING
    )
    private TransactionStatus status;

    @Column(
            length=1000
    )
    private String failureReason;

    @CreatedDate
    @Column(
            nullable=false,
            updatable=false
    )
    private LocalDateTime createdAt;

    @Lob
    private String gatewayResponse;
}
