package ar.edu.itba.parkingmanagmentapi.exceptions;

import org.springframework.http.HttpStatus;

public class BadRequestException extends BaseException {
    public BadRequestException(String message) {
        super(HttpStatus.BAD_REQUEST, message, ApiErrorCode.BAD_REQUEST.getCode());
    }

    public BadRequestException(String messageKey, Object... args) {
        super(HttpStatus.BAD_REQUEST, ApiErrorCode.BAD_REQUEST.getCode(), messageKey, args);
    }
}



