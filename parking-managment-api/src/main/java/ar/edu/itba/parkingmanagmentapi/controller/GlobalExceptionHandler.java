package ar.edu.itba.parkingmanagmentapi.controller;

import ar.edu.itba.parkingmanagmentapi.dto.ApiResponse;
import ar.edu.itba.parkingmanagmentapi.exceptions.ApiErrorCode;
import ar.edu.itba.parkingmanagmentapi.exceptions.BaseException;
import ar.edu.itba.parkingmanagmentapi.util.LocaleContextUtils;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    public GlobalExceptionHandler() {
    }

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

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidationException(MethodArgumentNotValidException ex, HttpServletRequest request) {
        logger.info("Validation failed: {}", ex.getMessage());

        List<String> errors = ex.getBindingResult().getFieldErrors()
                .stream()
                .map(err -> {
                    String fieldName = err.getField();
                    String defaultMessage = err.getDefaultMessage();
                    // Try to resolve the message using the error code if it exists
                    if (err.getCode() != null && LocaleContextUtils.hasMessage("validation.field." + err.getCode())) {
                        return LocaleContextUtils.getMessage("validation.field." + err.getCode(), fieldName);
                    }
                    // Fall back to default message
                    return String.format("Field [%s]: %s", fieldName, defaultMessage);
                })
                .collect(Collectors.toList());

        String validationMessage = LocaleContextUtils.getMessage("api.error.validation");
        ApiResponse<Void> response = new ApiResponse<>(
                false,
                null,
                validationMessage,
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

        String errorMessage = LocaleContextUtils.getMessage("error.internal.server.error");
        ApiResponse<Void> response = new ApiResponse<>(
                false,
                null,
                errorMessage,
                ApiErrorCode.INTERNAL_SERVER_ERROR.getCode(),
                null,
                Instant.now().toString(),
                request.getRequestURI()
        );

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }

    @ExceptionHandler(AuthorizationDeniedException.class)
    public ResponseEntity<ApiResponse<Void>> handleAuthorizationDeniedException(AuthorizationDeniedException ex, HttpServletRequest request) {
        logger.info("Authorization denied: {}", ex.getMessage());

        String errorMessage = LocaleContextUtils.getMessage("error.auth.access_denied");
        ApiResponse<Void> response = new ApiResponse<>(
                false,
                null,
                errorMessage,
                ApiErrorCode.ACCESS_DENIED.getCode(),
                null,
                Instant.now().toString(),
                request.getRequestURI()
        );

        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse<Void>> handleAccessDenied(AccessDeniedException ex, HttpServletRequest request) {
        logger.warn("Access denied: {}", ex.getMessage());

        String errorMessage = LocaleContextUtils.getMessage("error.auth.access_denied");
        ApiResponse<Void> response = new ApiResponse<>(
                false,
                null,
                errorMessage,
                ApiErrorCode.ACCESS_DENIED.getCode(),
                null,
                Instant.now().toString(),
                request.getRequestURI()
        );

        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
    }
}