package com.consult.backend.exception;

import com.consult.backend.dto.ApiResponseDto;
import com.consult.backend.util.ResponseUtil;
import io.jsonwebtoken.JwtException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    /*
     ======================================
     AUTHENTICATION ERRORS
     ======================================
    */
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiResponseDto<Object>> handleBadCredentials(
            BadCredentialsException ex
    ) {
        return ResponseUtil.error(
                "AUTH_401",
                "Invalid email or password",
                HttpStatus.UNAUTHORIZED
        );
    }

    /*
     ======================================
     JWT ERRORS
     ======================================
    */
    @ExceptionHandler(JwtException.class)
    public ResponseEntity<ApiResponseDto<Object>> handleJwtException(
            JwtException ex
    ) {
        return ResponseUtil.error(
                "TOKEN_INVALID",
                ex.getMessage(),
                HttpStatus.UNAUTHORIZED
        );
    }

    /*
     ======================================
     GENERIC ERRORS
     ======================================
    */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponseDto<Object>> handleGeneralException(
            Exception ex
    ) {
        return ResponseUtil.error(
                "SERVER_ERROR",
                ex.getMessage(),
                HttpStatus.INTERNAL_SERVER_ERROR
        );
    }
}
