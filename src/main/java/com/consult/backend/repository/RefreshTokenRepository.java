package com.consult.backend.repository;

import com.consult.backend.entity.RefreshToken;
import com.consult.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {


    Optional<RefreshToken> findByTokenId(String tokenId);

    void deleteByTokenId(String tokenId);


}
