package ar.edu.itba.parkingmanagmentapi.exceptions;

import org.springframework.http.HttpStatus;

public class NotFoundException extends BaseException {
    public NotFoundException(String message) {
        super(HttpStatus.NOT_FOUND, message, ApiErrorCode.NOT_FOUND.getCode());
    }

    public NotFoundException(String messageKey, Object... args) {
        super(HttpStatus.NOT_FOUND, ApiErrorCode.NOT_FOUND.getCode(), messageKey, args);
    }

}
