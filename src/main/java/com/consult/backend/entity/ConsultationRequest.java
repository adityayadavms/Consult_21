package com.consult.backend.entity;




import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Map;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;


@Entity
@Table(
        name="consultation_requests",
        indexes={
                @Index(
                        name="idx_consult_user",
                        columnList="user_id"
                ),
                @Index(
                        name="idx_consult_category",
                        columnList="category_id"
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConsultationRequest {

    @Id
    @GeneratedValue(
            strategy=GenerationType.IDENTITY
    )
    private Long id;

    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(
            name="user_id",
            nullable=false
    )
    private User user;

    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(
            name="category_id",
            nullable=false
    )
    private Category category;

    @OneToOne(
            mappedBy="consultationRequest",
            cascade=CascadeType.ALL
    )
    private PaymentOrder paymentOrder;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(
            columnDefinition="jsonb",
            nullable=false
    )
    private Map<String,Object> answersJson;

    @Column(length=2000)
    private String quickQuestion;

    private String email;

    private String phone;

    private String name;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist(){

        this.createdAt= LocalDateTime.now();

        this.updatedAt= LocalDateTime.now();

    }

    @PreUpdate
    public void preUpdate(){

        this.updatedAt=
                LocalDateTime.now();

    }

}
