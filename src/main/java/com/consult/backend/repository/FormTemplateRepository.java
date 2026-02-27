package com.consult.backend.repository;

import com.consult.backend.entity.FormTemplate;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FormTemplateRepository extends JpaRepository<FormTemplate, Long> {

    Optional<FormTemplate>  findByCategoryIdAndActiveTrue(Long categoryId);

}
