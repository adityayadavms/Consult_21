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

    // JWT Token ID (jti)
    @Column(nullable = false, unique = true)
    private String tokenId;

    // Session ID (device session)
    @Column(nullable = false, unique = true)
    private String sessionId;

    // Token Owner
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Expiry
    @Column(nullable = false)
    private LocalDateTime expiryDate;

    // Revoked Flag
    @Column(nullable = false)
    private boolean revoked = false;

    // Audit Field
    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
