package com.consult.backend.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ApiResponseDto<T> {

    private LocalDateTime timestamp;
    private int status;
    private String errorCode;
    private String message;
    private T data;
}
