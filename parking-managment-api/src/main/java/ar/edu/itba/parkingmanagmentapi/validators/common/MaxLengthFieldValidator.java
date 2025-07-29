package ar.edu.itba.parkingmanagmentapi.validators.common;

import ar.edu.itba.parkingmanagmentapi.exceptions.BadRequestException;

public class MaxLengthFieldValidator extends Validator<String> {
    private final int maxLength;

    public MaxLengthFieldValidator(int maxLength) {
        this.maxLength = maxLength;
    }

    @Override
    protected void validate(String value, String path) {
        if (value != null && value.length() > maxLength) {
            String ERROR_MESSAGE = "The value from [%s] is longer than the maximum length allowed. Actual value [%s]";
            throw new BadRequestException(String.format(ERROR_MESSAGE, path, maxLength));
        }
    }
}