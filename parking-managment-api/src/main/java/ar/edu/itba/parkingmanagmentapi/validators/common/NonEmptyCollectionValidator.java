package ar.edu.itba.parkingmanagmentapi.validators.common;

import ar.edu.itba.parkingmanagmentapi.exceptions.BadRequestException;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
import java.util.Collection;

@Component
public class NonEmptyCollectionValidator extends Validator<Collection> {
 @Override
 protected void validate(Collection collection, String path) {
   if (CollectionUtils.isEmpty(collection)) {
     throw new BadRequestException(String.format(ERROR_MESSAGE_MANDATORY, path));
   }
 }
}
