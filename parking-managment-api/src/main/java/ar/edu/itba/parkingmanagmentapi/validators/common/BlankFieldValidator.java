package ar.edu.itba.parkingmanagmentapi.validators.common;

import ar.edu.itba.parkingmanagmentapi.exceptions.BadRequestException;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Component;

@Component
public class BlankFieldValidator extends Validator<String> {
  @Override
  protected void validate(String value, String path) {
    if (StringUtils.isBlank(value)) {
      throw new BadRequestException(String.format(ERROR_MESSAGE_MANDATORY, path));
    }
  }
}