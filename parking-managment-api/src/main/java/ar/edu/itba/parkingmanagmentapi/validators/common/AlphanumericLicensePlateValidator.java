package ar.edu.itba.parkingmanagmentapi.validators.common;

import org.springframework.stereotype.Component;

@Component
public class AlphanumericLicensePlateValidator extends PatternValidator {
    // Valida patentes argentinas (viejo y nuevo formato)
    private static final String PATTERN = "^([A-Z]{3}[0-9]{3}|[A-Z]{2}[0-9]{3}[A-Z]{2})$";

    public AlphanumericLicensePlateValidator() {
        super(PATTERN);
    }
}
