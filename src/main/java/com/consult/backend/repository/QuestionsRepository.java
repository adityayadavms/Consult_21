package com.consult.backend.repository;

import com.consult.backend.entity.Questions;
import com.consult.backend.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.domain.Pageable;

public interface QuestionsRepository extends JpaRepository<Questions, Long> {
    // PAGINATION QUERY
    Page<Questions> findByUserOrderByAskedAtDesc(User user, Pageable pageable);
}
