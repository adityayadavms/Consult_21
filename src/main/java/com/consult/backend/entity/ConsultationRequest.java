package com.consult.backend.entity;

import com.consult.backend.entity.Entity.PaymentStatus;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity

@Table(name = "consultation_requests",
        indexes = {
                @Index(name = "idx_consult_user", columnList = "user_id"),
                @Index(name = "idx_consult_category", columnList = "category_id")
        })

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ConsultationRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /*
     ============================
     RELATIONS
     ============================
    */

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    /*
     ============================
     DYNAMIC ANSWERS
     ============================
    */

    @Column(columnDefinition = "jsonb", nullable = false)
    private String answersJson;

    /*
     ============================
     PAYMENT INFO
     ============================
    */

    private Integer amount;  // store in rupees (21)

    @Enumerated(EnumType.STRING)
    private PaymentStatus paymentStatus;

    private String razorpayOrderId;
    private String razorpayPaymentId;

    /*
     ============================
     TIMESTAMPS
     ============================
    */

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;


    /*
     ============================
     TimeStampHandling
     ============================
    */

    @PrePersist
    public void prePersist(){
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.paymentStatus = PaymentStatus.PENDING;
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}

