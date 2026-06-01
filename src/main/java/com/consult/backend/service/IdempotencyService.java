package com.consult.backend.service;

import com.consult.backend.entity.IdempotencyKey;
import com.consult.backend.repository.IdempotencyKeyRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.HexFormat;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class IdempotencyService {
    private final IdempotencyKeyRepository
            idempotencyKeyRepository;

    public Optional<IdempotencyKey>
    findByKey(String idempotencyKey) {

        return idempotencyKeyRepository
                .findByIdempotencyKey(
                        idempotencyKey
                );
    }

    @Transactional
    public void saveResponse(
            String idempotencyKey,
            String requestHash,
            String responseBody
    ) {

        IdempotencyKey entity =
                IdempotencyKey.builder()
                        .idempotencyKey(idempotencyKey)
                        .requestHash(requestHash)
                        .responseBody(responseBody)
                        .build();

        idempotencyKeyRepository.save(entity);
    }

    public boolean matchesRequest(
            IdempotencyKey stored,
            String requestHash
    ) {

        return stored.getRequestHash()
                .equals(requestHash);
    }

    public String generateRequestHash(
            String payload
    ) {

        try {

            MessageDigest digest =
                    MessageDigest.getInstance(
                            "SHA-256"
                    );

            byte[] hash =
                    digest.digest(
                            payload.getBytes(
                                    StandardCharsets.UTF_8
                            )
                    );

            return HexFormat.of()
                    .formatHex(hash);

        }

        catch (Exception e) {

            throw new RuntimeException(
                    "Failed to generate request hash", e
            );
        }
    }

}
