package ar.edu.itba.parkingmanagmentapi.validators.common;

import ar.edu.itba.parkingmanagmentapi.exceptions.BadRequestException;

import java.util.regex.Pattern;

public abstract class PatternValidator extends Validator<String> {
    private final Pattern pattern;
    private static final String ERROR_MESSAGE = "The value from [%s] is not an alphanumeric value. Actual value [%s]";

    public PatternValidator(String pattern) {
        this.pattern = Pattern.compile(pattern);
    }

    @Override
    protected void validate(String value, String path) {
        if (!pattern.matcher(value).matches()) {
            throw new BadRequestException(String.format(ERROR_MESSAGE, path, value));
        }
    }
}
