package ar.edu.itba.parkingmanagmentapi.exceptions;

import org.springframework.http.HttpStatus;

public class AlreadyExistsException extends BaseException {
    public AlreadyExistsException(String message) {
        super(HttpStatus.CONFLICT, message, ApiErrorCode.ALREADY_EXISTS.getCode());
    }
}