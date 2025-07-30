package ar.edu.itba.parkingmanagmentapi.validators.common;

import org.springframework.stereotype.Component;

@Component
public class LengthRangeFieldPasswordValidator extends LengthRangeFieldValidator {
    private static final int minLength = 6;
    private static final int maxLength = 20;

    public LengthRangeFieldPasswordValidator() {
        super(minLength, maxLength);
    }
}
