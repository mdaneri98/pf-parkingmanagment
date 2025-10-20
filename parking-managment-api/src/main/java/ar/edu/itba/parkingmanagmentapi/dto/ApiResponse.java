package ar.edu.itba.parkingmanagmentapi.dto;

import ar.edu.itba.parkingmanagmentapi.util.LocaleContextUtils;
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
        return new ApiResponse<>(true, data, LocaleContextUtils.getMessage("api.success.operation"));
    }

    public static <T> ApiResponse<T> success(T data, String messageKey, Object... args) {
        return new ApiResponse<>(true, data, LocaleContextUtils.getMessage(messageKey, args));
    }

    public static <T> ApiResponse<T> error(String messageKey, Object... args) {
        return new ApiResponse<>(false, null, LocaleContextUtils.getMessage(messageKey, args), null, null, null, null);
    }

    public static <T> ApiResponse<T> error(String messageKey, String errorCode, Object... args) {
        return new ApiResponse<>(false, null, LocaleContextUtils.getMessage(messageKey, args), errorCode, null, null, null);
    }

    public static <T> ApiResponse<T> validationError(List<String> errors) {
        return new ApiResponse<>(false, null, LocaleContextUtils.getMessage("api.error.validation"), "VALIDATION_ERROR", errors, null, null);
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
