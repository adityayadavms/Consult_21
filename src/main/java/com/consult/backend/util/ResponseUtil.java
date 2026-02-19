package com.consult.backend.util;

import com.consult.backend.dto.ApiResponseDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;

public class ResponseUtil {
     public static <T> ResponseEntity<ApiResponseDto<T>> success(T data, String message) {
        return ResponseEntity.ok(
                ApiResponseDto.<T>builder()
                        .timestamp(LocalDateTime.now())
                        .status(HttpStatus.OK.value())
                        .errorCode(null)
                        .message(message)
                        .data(data)
                        .build()
        );
    }

    public static <T> ResponseEntity<ApiResponseDto<T>> error(String errorCode,String message, HttpStatus status) {
        return ResponseEntity.status(status)
                .body(
                        ApiResponseDto.<T>builder()
                                .timestamp(LocalDateTime.now())
                                .status(status.value())
                                .errorCode(errorCode)
                                .message(message)
                                .data(null)
                                .build()
                );
    }
 }
