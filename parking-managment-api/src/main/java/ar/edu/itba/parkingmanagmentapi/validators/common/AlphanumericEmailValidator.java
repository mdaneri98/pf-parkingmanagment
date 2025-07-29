package ar.edu.itba.parkingmanagmentapi.validators.common;

import org.springframework.stereotype.Component;

@Component
public class AlphanumericEmailValidator extends PatternValidator {
    private static final String ERROR_MESSAGE = "The value from [%s] is not an alphanumeric value. Actual value [%s]";
    private static final String PATTERN = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";

    public AlphanumericEmailValidator() {
        super(PATTERN, ERROR_MESSAGE);
    }
}
