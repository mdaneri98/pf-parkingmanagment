package ar.edu.itba.parkingmanagmentapi.validators.common;

import org.springframework.stereotype.Component;

@Component
public class AlphanumericEmailValidator extends PatternValidator {
    // Acepta: emails con subdominios múltiples, evita guiones al inicio/final de dominios
    // Ejemplos: "user@domain.com", "test@sub.domain.com", "user@my-domain.com"
    private static final String PATTERN = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$";

    public AlphanumericEmailValidator() {
        super(PATTERN);
    }
}
