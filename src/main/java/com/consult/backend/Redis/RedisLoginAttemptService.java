package com.consult.backend.Redis;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
@RequiredArgsConstructor
public class RedisLoginAttemptService {
    private final StringRedisTemplate redisTemplate;

    private static final int MAX_ATTEMPTS = 5;
    private static final Duration BLOCK_TIME = Duration.ofMinutes(15);

    private String getKey(String email) {
        return "login:attempts:" + email;
    }

    /*
     ======================================
     CHECK IF USER IS BLOCKED
     ======================================
    */
    public boolean isBlocked(String email) {
        String key = getKey(email);

        String attempts = redisTemplate.opsForValue().get(key);

        if (attempts == null) {
            return false;
        }

        return Integer.parseInt(attempts) >= MAX_ATTEMPTS;
    }

    /*
     ======================================
     RECORD FAILED LOGIN ATTEMPT
     ======================================
    */
    public void loginFailed(String email) {
        String key = getKey(email);

        Long attempts = redisTemplate.opsForValue().increment(key);

        if (attempts != null && attempts == 1) {
            redisTemplate.expire(key, BLOCK_TIME);
        }
    }

    /*
     ======================================
     RESET ON SUCCESSFUL LOGIN
     ======================================
    */
    public void loginSucceeded(String email) {
        redisTemplate.delete(getKey(email));
    }
}
