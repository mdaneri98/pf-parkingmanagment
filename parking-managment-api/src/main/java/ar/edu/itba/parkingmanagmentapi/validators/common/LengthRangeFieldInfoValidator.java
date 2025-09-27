package ar.edu.itba.parkingmanagmentapi.validators.common;

import org.springframework.stereotype.Component;

@Component
public class LengthRangeFieldInfoValidator extends LengthRangeFieldValidator {
    private static final int minLength = 3;
    private static final int maxLength = 80;

    public LengthRangeFieldInfoValidator() {
        super(minLength, maxLength);
    }

}
