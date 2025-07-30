package ar.edu.itba.parkingmanagmentapi.validators.common;

import org.springframework.stereotype.Component;

@Component
public class AlphanumericWithDashFieldValidator extends PatternValidator {
    private static final String PATTERN = "^[a-zA-Z0-9-]+$";

    public AlphanumericWithDashFieldValidator() {
        super(PATTERN);
    }
}
