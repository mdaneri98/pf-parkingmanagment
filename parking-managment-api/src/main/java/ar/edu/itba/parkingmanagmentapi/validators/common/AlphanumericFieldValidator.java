package ar.edu.itba.parkingmanagmentapi.validators.common;

import org.springframework.stereotype.Component;

@Component
public class AlphanumericFieldValidator extends PatternValidator {
    private static final String PATTERN = "^[a-zA-Z]$";

    public AlphanumericFieldValidator() {
        super(PATTERN);
    }
}
