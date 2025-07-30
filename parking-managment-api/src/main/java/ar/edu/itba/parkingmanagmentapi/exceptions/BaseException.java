package ar.edu.itba.parkingmanagmentapi.exceptions;

import ar.edu.itba.parkingmanagmentapi.dto.ApiResponse;
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

    public BaseException(HttpStatus status, String message, String errorCode, Throwable cause) {
        super(message, cause);
        this.status = status;
        this.response = new ApiResponse<>(
                false,
                message,
                errorCode
        );
    }
}

