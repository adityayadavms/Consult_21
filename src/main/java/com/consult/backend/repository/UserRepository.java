package com.consult.backend.repository;

import com.consult.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User,Long> {

    // Find user during login
    Optional<User> findByEmail(String email);

    // Check if email already exists during signup
    boolean existsByEmail(String email);

}
