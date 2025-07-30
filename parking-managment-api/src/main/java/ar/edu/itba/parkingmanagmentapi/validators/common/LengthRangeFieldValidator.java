package ar.edu.itba.parkingmanagmentapi.validators.common;

import ar.edu.itba.parkingmanagmentapi.exceptions.BadRequestException;

public class LengthRangeFieldValidator extends Validator<String> {

    private final int minLength;
    private final int maxLength;

    private static final String ERROR_MESSAGE = "The value for [%s] must be between %d and %d characters. Actual length: %d";

    public LengthRangeFieldValidator(int minLength, int maxLength) {
        if (minLength < 0 || maxLength < minLength) {
            throw new IllegalArgumentException("Invalid min/max length range");
        }
        this.minLength = minLength;
        this.maxLength = maxLength;
    }

    @Override
    protected void validate(String value, String path) {
        if (value != null) {
            int length = value.length();
            if (length < minLength || length > maxLength) {
                throw new BadRequestException(String.format(ERROR_MESSAGE, path, minLength, maxLength, length));
            }
        }
    }
}
