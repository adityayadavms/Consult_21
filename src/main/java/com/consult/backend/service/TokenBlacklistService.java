package com.consult.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
@RequiredArgsConstructor
public class TokenBlacklistService {

    private final RedisTemplate<String,String> redisTemplate;

    private static final String BLACKLIST_PREFIX="BLACKLIST:";


    /*
    =====================================
    ADD TOKEN TO BLACKLIST
    =====================================
   */
    public void blacklistToken(String token, long expiryMillis) {

        String key = BLACKLIST_PREFIX + token;

        redisTemplate.opsForValue()
                .set(key, "BLACKLISTED", Duration.ofMillis(expiryMillis));
    }

    /*
     =====================================
     CHECK IF TOKEN IS BLACKLISTED
     =====================================
    */
    public boolean isBlacklisted(String token) {

        String key = BLACKLIST_PREFIX + token;

        return Boolean.TRUE.equals(redisTemplate.hasKey(key));
    }


}
