package ar.edu.itba.parkingmanagmentapi.exceptions;

import org.springframework.http.HttpStatus;

public class AuthenticationFailedException extends BaseException {
    public AuthenticationFailedException(String message) {
        super(HttpStatus.UNAUTHORIZED, message, ApiErrorCode.AUTHENTICATION_FAILED.getCode());
    }

    public AuthenticationFailedException(String messageKey, Object... args) {
        super(HttpStatus.UNAUTHORIZED, ApiErrorCode.AUTHENTICATION_FAILED.getCode(), messageKey, args);
    }

}