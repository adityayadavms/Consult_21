package com.consult.backend.repository;
import com.consult.backend.entity.ProcessedWebhook;
import org.springframework.data.jpa.repository.JpaRepository;


public interface ProcessedWebhookRepository extends JpaRepository<ProcessedWebhook,Long>{
    boolean existsByWebhookId(String webhookId);
}
