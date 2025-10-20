package ar.edu.itba.parkingmanagmentapi.exceptions;

import ar.edu.itba.parkingmanagmentapi.dto.ApiResponse;
import ar.edu.itba.parkingmanagmentapi.util.LocaleContextUtils;
import lombok.Getter;
import org.springframework.http.HttpStatus;

public class BaseException extends RuntimeException {
    @Getter
    private final ApiResponse<Void> response;
    @Getter
    private final HttpStatus status;

    public BaseException(HttpStatus status, String message, String errorCode) {
        super(message);
        this.status = status;
        this.response = new ApiResponse<>(
                false,
                message,
                errorCode
        );
    }

    public BaseException(HttpStatus status, String errorCode, String message, Throwable cause) {
        super(message, cause);
        this.status = status;
        this.response = new ApiResponse<>(
                false,
                message,
                errorCode
        );
    }

    public BaseException(HttpStatus status, String errorCode, String messageKey, Object... args) {
        super(LocaleContextUtils.getMessage(messageKey, args));
        this.status = status;
        this.response = new ApiResponse<>(
                false,
                LocaleContextUtils.getMessage(messageKey, args),
                errorCode
        );
    }

    public BaseException(HttpStatus status, String errorCode, String messageKey, Throwable cause, Object... args) {
        super(LocaleContextUtils.getMessage(messageKey, args), cause);
        this.status = status;
        this.response = new ApiResponse<>(
                false,
                LocaleContextUtils.getMessage(messageKey, args),
                errorCode
        );
    }
}

