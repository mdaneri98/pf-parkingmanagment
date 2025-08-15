package ar.edu.itba.parkingmanagmentapi.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse<T> {
    private boolean success;
    private T data;
    private String message;
    private String errorCode;
    private List<String> errors;
    private String timestamp;
    private String path;

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

    // Factory methods
    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(true, data, "Operation completed successfully");
    }

    public static <T> ApiResponse<T> success(T data, String message) {
        return new ApiResponse<>(true, data, message);
    }

    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(false, null, message, null, null, null, null);
    }

    public static <T> ApiResponse<T> error(String message, String errorCode) {
        return new ApiResponse<>(false, null, message, errorCode, null, null, null);
    }

    public static <T> ApiResponse<T> validationError(List<String> errors) {
        return new ApiResponse<>(false, null, "Validation failed", "VALIDATION_ERROR", errors, null, null);
    }

    public static <T> ResponseEntity<ApiResponse<T>> ok(T data) {
        return ResponseEntity.ok(success(data));
    }

    public static <T> ResponseEntity<ApiResponse<T>> created(T data) {
        return ResponseEntity.status(HttpStatus.CREATED).body(success(data));
    }

    public static <T> ResponseEntity<ApiResponse<T>> noContent() {
        return ResponseEntity.noContent().build();
    }

    // Utility methods
    public boolean isFailure() {
        return !success;
    }

    public boolean isSuccess() {
        return success;
    }

    public boolean hasData() {
        return data != null;
    }

    public boolean hasErrors() {
        return errors != null && !errors.isEmpty();
    }

    public boolean hasErrorCode() {
        return errorCode != null;
    }
}
