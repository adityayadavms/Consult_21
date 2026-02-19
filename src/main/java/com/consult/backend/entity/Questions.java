package com.consult.backend.entity;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(
        name = "questions",
        indexes = {
                @Index(name = "idx_question_user", columnList = "user_id")
        }
)
@Builder
public class Questions {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // QUESTION TEXT
    @Column(nullable = false, length = 2000)
    private String question;

    // MANY QUESTIONS → ONE USER
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;


    // CREATED TIMESTAMP
    private LocalDateTime askedAt;
}
