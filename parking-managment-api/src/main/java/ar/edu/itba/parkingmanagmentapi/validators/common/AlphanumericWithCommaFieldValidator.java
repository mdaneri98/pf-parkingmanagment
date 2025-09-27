package ar.edu.itba.parkingmanagmentapi.validators.common;

import org.springframework.stereotype.Component;

@Component
public class AlphanumericWithCommaFieldValidator extends PatternValidator {
    // Acepta: letras, números, espacios, puntos, comas, guiones, apóstrofes, paréntesis, símbolos + y #
    // Ejemplos: "+54 11 1234-5678", "(11) 1234-5678", "Av. Corrientes 1234", "Calle 123, Piso 4°"
    private static final String PATTERN = "^[\\p{L}\\p{N}\\s.,'-()+#]+$";

    public AlphanumericWithCommaFieldValidator() {
        super(PATTERN);
    }
}
