package com.consult.backend.Configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;

@Configuration
public class AuditConfig {

    @Bean
    public AuditorAware<String> auditorProvider() {

        return () -> Optional.of(
                SecurityContextHolder.getContext()
                        .getAuthentication()
                        .getName()
        );
    }
 }
