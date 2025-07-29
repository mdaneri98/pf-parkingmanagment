package ar.edu.itba.parkingmanagmentapi.validators.common;

import ar.edu.itba.parkingmanagmentapi.exceptions.BadRequestException;
import org.springframework.stereotype.Component;
import java.util.Objects;

@Component
public class MandatoryFieldValidator extends Validator<Object> {
    @Override
    protected void validate(Object object, String path) {
        if (Objects.isNull(object)) {
            throw new BadRequestException(String.format(ERROR_MESSAGE_MANDATORY, path));
        }
    }
}
