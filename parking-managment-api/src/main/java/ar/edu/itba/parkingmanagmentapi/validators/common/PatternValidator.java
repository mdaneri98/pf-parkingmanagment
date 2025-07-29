package ar.edu.itba.parkingmanagmentapi.validators.common;

import ar.edu.itba.parkingmanagmentapi.exceptions.BadRequestException;
import java.util.regex.Pattern;

public abstract class PatternValidator extends Validator<String> {
    private final Pattern pattern;
    private final String errorMessage;

    public PatternValidator(String pattern, String errorMessage) {
        this.pattern = Pattern.compile(pattern);
        this.errorMessage = errorMessage;
    }

    @Override
    protected void validate(String value, String path) {
        if (!pattern.matcher(value).matches()) {
            throw new BadRequestException(String.format(errorMessage, path, value));
        }
    }
}
