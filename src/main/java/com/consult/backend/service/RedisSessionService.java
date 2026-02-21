package com.consult.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
@RequiredArgsConstructor
public class RedisSessionService {
    private final RedisTemplate<String, Object> redisTemplate;

    private static final String SESSION_PREFIX = "session:";

    /*
     =========================================
     STORE SESSION
     =========================================
    */
    public void storeSession(String tokenId, String sessionId, Duration ttl) {

        String key = SESSION_PREFIX + tokenId;

        redisTemplate.opsForValue().set(key, sessionId, ttl);
    }

    /*
     =========================================
     CHECK SESSION ACTIVE
     =========================================
    */
    public boolean isSessionActive(String tokenId) {

        String key = SESSION_PREFIX + tokenId;

        return redisTemplate.hasKey(key);
    }

    /*
     =========================================
     DELETE SESSION
     =========================================
    */
    public void deleteSession(String tokenId) {

        String key = SESSION_PREFIX + tokenId;

        redisTemplate.delete(key);
    }

}
