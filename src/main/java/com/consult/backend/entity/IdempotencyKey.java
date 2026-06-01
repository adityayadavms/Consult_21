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
        name="idempotency_keys"
)

public class IdempotencyKey {
    @Id
    @GeneratedValue(
            strategy = GenerationType.IDENTITY
    )
    private Long id;

    @Column(
            nullable=false,
            unique=true
    )
    private String idempotencyKey;

    @Column(
            nullable=false,
            length = 2000
    )
    private String requestHash;

    @Lob
    private String responseBody;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}
