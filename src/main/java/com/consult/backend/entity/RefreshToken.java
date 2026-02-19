package com.consult.backend.entity;


import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;


import java.time.LocalDateTime;

@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(name = "refresh_tokens")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RefreshToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // UNIQUE TOKEN STRING (JWT)
    @Column(nullable = false, unique = true, length = 500)
    private String token;

    // TOKEN OWNER
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // EXPIRATION TIME
    @Column(nullable = false)
    private LocalDateTime expiryDate;

    // REVOKED FLAG (for logout/security)
    @Column(nullable = false)
    private boolean revoked = false;

    // UNIQUE TOKEN ID (UUID inside JWT)
    @Column(nullable = false, unique = true)
    private String tokenId;

    // AUDIT FIELD
    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
