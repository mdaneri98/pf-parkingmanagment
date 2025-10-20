package ar.edu.itba.parkingmanagmentapi.validators.common;

import org.springframework.stereotype.Component;

@Component
public class PhoneFieldValidator extends PatternValidator {
    private static final String PATTERN = "^(\\+)?[0-9\\s\\-()]{7,20}$";

    public PhoneFieldValidator() {
        super(PATTERN);
    }

}
