package ar.edu.itba.parkingmanagmentapi.exceptions;

import org.springframework.http.HttpStatus;

public class BadCredentialsException extends BaseException {

    public BadCredentialsException(String message) {
        super(HttpStatus.UNAUTHORIZED, message, ApiErrorCode.INVALID_CREDENTIALS.getCode());
    }
}
