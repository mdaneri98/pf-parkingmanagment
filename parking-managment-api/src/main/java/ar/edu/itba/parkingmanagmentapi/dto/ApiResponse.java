package ar.edu.itba.parkingmanagmentapi.dto;

import java.time.Instant;
import java.util.List;

public record ApiResponse<T>(
        boolean success,
        T data,
        String message,
        String errorCode,
        List<String> errors,
        String timestamp,
        String path
) {
    // Constructor compacto
    public ApiResponse {
        if (timestamp == null) {
            timestamp = Instant.now().toString();
        }
    }

    // Constructores de conveniencia
    public ApiResponse(boolean success, T data, String message) {
        this(success, data, message, null, null, null, null);
    }

    public ApiResponse(boolean success, String message) {
        this(success, null, message, null, null, null, null);
    }

    public ApiResponse(boolean success, String message, String errorCode) {
        this(success, null, message, errorCode, null, null, null);
    }

    // Métodos factory
    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(true, data, "Operation completed successfully");
    }

    public static <T> ApiResponse<T> success(T data, String message) {
        return new ApiResponse<>(true, data, message);
    }

    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(false, null, message);
    }

    public static <T> ApiResponse<T> error(String message, String errorCode) {
        return new ApiResponse<>(false, null, message, errorCode, null, null, null);
    }

    public static <T> ApiResponse<T> validationError(List<String> errors) {
        return new ApiResponse<>(false, null, "Validation failed", "VALIDATION_ERROR", errors, null, null);
    }

    // Métodos de utilidad
    public boolean isFailure() { return !success; }
    public boolean hasData() { return data != null; }
    public boolean hasErrors() { return errors != null && !errors.isEmpty(); }
    public boolean hasErrorCode() { return errorCode != null; }
}