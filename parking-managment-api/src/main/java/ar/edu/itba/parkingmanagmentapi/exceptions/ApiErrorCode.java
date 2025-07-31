package ar.edu.itba.parkingmanagmentapi.exceptions;

public enum ApiErrorCode {

    // General HTTP errors
    BAD_REQUEST("bad.request"),
    UNAUTHORIZED("unauthorized"),
    FORBIDDEN("forbidden"),
    NOT_FOUND("not.found"),
    METHOD_NOT_ALLOWED("method.not.allowed"),
    UNSUPPORTED_MEDIA_TYPE("unsupported.media.type"),
    INTERNAL_SERVER_ERROR("internal.server.error"),
    ALREADY_EXISTS("already_exists"),

    // Auth & Security
    INVALID_CREDENTIALS("auth.invalid_credentials"),
    AUTHENTICATION_FAILED("auth.authentication_failed"),
    EXPIRED_JWT_TOKEN("auth.expired_jwt_token"),
    INVALID_JWT_TOKEN("auth.invalid_jwt_token"),
    INVALID_JWT_CLAIM("auth.invalid_jwt_claim"),
    ACCESS_DENIED("auth.access_denied"),
    USER_DISABLED("auth.user_disabled"),
    
    // Validation
    VALIDATION_ERROR("validation.error");


    private final String code;

    ApiErrorCode(String code) {
        this.code = code;
    }

    public String getCode() {
        return code;
    }

    @Override
    public String toString() {
        return code;
    }
}
