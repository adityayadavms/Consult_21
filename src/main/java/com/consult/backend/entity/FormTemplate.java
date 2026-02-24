package com.consult.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="form_templates")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FormTemplate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="category_id", nullable = false)
    private Category category;

    @Column(columnDefinition = "jsonb", nullable = false)
    private String schemaJson;

    @Column(nullable = false)
    private boolean active;

}
