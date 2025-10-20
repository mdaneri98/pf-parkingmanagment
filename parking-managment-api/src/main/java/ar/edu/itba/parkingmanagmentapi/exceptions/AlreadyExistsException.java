package ar.edu.itba.parkingmanagmentapi.exceptions;

import org.springframework.http.HttpStatus;

public class AlreadyExistsException extends BaseException {
    public AlreadyExistsException(String message) {
        super(HttpStatus.CONFLICT, message, ApiErrorCode.ALREADY_EXISTS.getCode());
    }

    public AlreadyExistsException(String messageKey, Object... args) {
        super(HttpStatus.CONFLICT, ApiErrorCode.ALREADY_EXISTS.getCode(), messageKey, args);
    }
}