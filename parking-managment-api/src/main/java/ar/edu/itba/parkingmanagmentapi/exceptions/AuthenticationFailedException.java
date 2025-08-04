package ar.edu.itba.parkingmanagmentapi.exceptions;

import org.springframework.http.HttpStatus;

public class AuthenticationFailedException extends BaseException {
    public AuthenticationFailedException(String message) {
        super(HttpStatus.UNAUTHORIZED, message, ApiErrorCode.AUTHENTICATION_FAILED.getCode());
    }


}