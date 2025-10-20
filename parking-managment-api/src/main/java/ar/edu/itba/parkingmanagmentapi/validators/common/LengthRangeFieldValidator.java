package ar.edu.itba.parkingmanagmentapi.validators.common;

import ar.edu.itba.parkingmanagmentapi.exceptions.BadRequestException;
import ar.edu.itba.parkingmanagmentapi.util.LocaleContextUtils;

public class LengthRangeFieldValidator extends Validator<String> {

    private final int minLength;
    private final int maxLength;

    private static final String ERROR_MESSAGE_KEY = "validation.field.length_range";

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
                throw new BadRequestException(LocaleContextUtils.getMessage(ERROR_MESSAGE_KEY, path, minLength, maxLength, length));
            }
        }
    }
}
