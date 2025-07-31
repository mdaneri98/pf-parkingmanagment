package ar.edu.itba.parkingmanagmentapi.controller;

import ar.edu.itba.parkingmanagmentapi.dto.ApiResponse;
import ar.edu.itba.parkingmanagmentapi.exceptions.ApiErrorCode;
import ar.edu.itba.parkingmanagmentapi.exceptions.BaseException;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(BaseException.class)
    public ResponseEntity<ApiResponse<Void>> handleBaseException(BaseException ex, HttpServletRequest request) {
        logger.info("Base exception occurred: {}", ex.getMessage());
        
        ApiResponse<Void> original = ex.getResponse();

        ApiResponse<Void> response = new ApiResponse<>(
                original.isSuccess(),
                null,
                original.getMessage(),
                original.getErrorCode(),
                original.getErrors(),
                Instant.now().toString(),
                request.getRequestURI()
        );

        return ResponseEntity.status(ex.getStatus()).body(response);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiResponse<Void>> handleBadCredentialsException(BadCredentialsException ex, HttpServletRequest request) {
        logger.info("Bad credentials provided: {}", ex.getMessage());
        
        ApiResponse<Void> response = new ApiResponse<>(
                false,
                null,
                "Invalid credentials",
                ApiErrorCode.INVALID_CREDENTIALS.getCode(),
                null,
                Instant.now().toString(),
                request.getRequestURI()
        );
        
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ApiResponse<Void>> handleAuthenticationException(AuthenticationException ex, HttpServletRequest request) {
        logger.info("Authentication failed: {}", ex.getMessage());
        
        ApiResponse<Void> response = new ApiResponse<>(
                false,
                null,
                "Authentication failed",
                ApiErrorCode.AUTHENTICATION_FAILED.getCode(),
                null,
                Instant.now().toString(),
                request.getRequestURI()
        );
        
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidationException(MethodArgumentNotValidException ex, HttpServletRequest request) {
        logger.info("Validation failed: {}", ex.getMessage());
        
        List<String> errors = ex.getBindingResult().getFieldErrors()
                .stream()
                .map(err -> String.format("Field [%s]: %s", err.getField(), err.getDefaultMessage()))
                .collect(Collectors.toList());

        ApiResponse<Void> response = new ApiResponse<>(
                false,
                null,
                "Validation failed",
                ApiErrorCode.VALIDATION_ERROR.getCode(),
                errors,
                Instant.now().toString(),
                request.getRequestURI()
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGenericException(Exception ex, HttpServletRequest request) {
        logger.info("Unhandled exception occurred: {}", ex.getMessage(), ex);
        
        ApiResponse<Void> response = new ApiResponse<>(
                false,
                null,
                "Internal server error",
                ApiErrorCode.INTERNAL_SERVER_ERROR.getCode(),
                null,
                Instant.now().toString(),
                request.getRequestURI()
        );
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}