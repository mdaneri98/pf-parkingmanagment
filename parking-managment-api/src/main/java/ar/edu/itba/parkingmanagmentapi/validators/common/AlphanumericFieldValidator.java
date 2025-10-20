package ar.edu.itba.parkingmanagmentapi.validators.common;

import org.springframework.stereotype.Component;

@Component
public class AlphanumericFieldValidator extends PatternValidator {
    // Acepta: letras Unicode, espacios, guiones, apóstrofes
    private static final String PATTERN = "^[\\p{L}\\s'-]+$";

    public AlphanumericFieldValidator() {
        super(PATTERN);
    }
}
