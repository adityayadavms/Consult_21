package com.consult.backend.entity;

import com.consult.backend.entity.Entity.PaymentStatus;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import java.util.ArrayList;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@EntityListeners(
        AuditingEntityListener.class
)

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor

@Table(
        name = "payment_orders",
        indexes = {

                @Index(
                        name = "idx_payment_order",
                        columnList = "orderId"
                ),

                @Index(
                        name = "idx_gateway_order",
                        columnList = "gatewayOrderId"
                )

        }
)
public class PaymentOrder {

    @Id
    @GeneratedValue(
            strategy = GenerationType.IDENTITY
    )
    private Long id;

    /*
    =======================================
    INTERNAL ORDER ID
    =======================================
    */

    @Column(
            nullable = false,
            unique = true
    )
    private String orderId;

    /*
    =======================================
    CONSULTATION RELATION
    =======================================
    */

    @OneToOne(
            fetch = FetchType.LAZY
    )
    @JoinColumn(
            name = "consultation_id",
            nullable = false,
            unique = true
    )
    private ConsultationRequest consultationRequest;

    /*
    =======================================
    TRANSACTIONS
    =======================================
    */

    @OneToMany(
            mappedBy = "paymentOrder",
            cascade = CascadeType.ALL
    )
    @Builder.Default
    private List<PaymentTransaction> transactions = new ArrayList<>();

    /*
    =======================================
    PAYMENT DETAILS
    =======================================
    */

    @Column(
            nullable = false,
            precision = 10,
            scale = 2
    )
    private BigDecimal amount;

    @Column(
            nullable = false
    )
    private String currency;

    @Enumerated(
            EnumType.STRING
    )
    @Column(
            nullable = false
    )
    @Builder.Default
    private PaymentStatus status = PaymentStatus.PENDING;

    /*
    =======================================
    GATEWAY ORDER ID
    =======================================
    */

    @Column(
            nullable = false,
            unique = true
    )
    private String gatewayOrderId;

    /*
    =======================================
    AUDIT
    =======================================
    */

    @CreatedDate
    @Column(
            nullable = false,
            updatable = false
    )
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    /*
    =======================================
    FALLBACK TIMESTAMP
    =======================================
    */

    @PrePersist
    public void prePersist() {

        if (status == null) {
            status = PaymentStatus.PENDING;
        }

    }

}