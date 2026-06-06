package com.consult.backend.entity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor

@Table(
        name="processed_webhooks"
)
public class ProcessedWebhook {

    @Id
    @GeneratedValue(
            strategy = GenerationType.IDENTITY
    )
    private Long id;

    @Column(
            nullable=false,
            unique=true
    )
    private String webhookId;


    /*
    ========================================
    EVENT TYPE
    Example:
    PAYMENT_SUCCESS_WEBHOOK
    ========================================
    */

    @Column(
            nullable = false
    )
    private String eventType;

    /*
    ========================================
    RAW PAYLOAD
    ========================================
    */

    @Lob
    private String payload;

    @Column(
            nullable=false
    )
    private LocalDateTime processedAt;
}
