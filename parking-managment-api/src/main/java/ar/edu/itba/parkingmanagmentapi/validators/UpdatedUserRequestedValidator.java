package ar.edu.itba.parkingmanagmentapi.validators;

import ar.edu.itba.parkingmanagmentapi.dto.UpdateUserRequest;
import ar.edu.itba.parkingmanagmentapi.exceptions.BadRequestException;
import ar.edu.itba.parkingmanagmentapi.validators.common.AlphanumericFieldValidator;
import ar.edu.itba.parkingmanagmentapi.validators.common.AlphanumericWithDashFieldValidator;
import ar.edu.itba.parkingmanagmentapi.validators.common.LengthRangeFieldInfoValidator;
import org.springframework.stereotype.Component;

import java.util.Objects;

@Component
public class UpdatedUserRequestedValidator {
    private final AlphanumericFieldValidator alphanumericValidator;
    private final LengthRangeFieldInfoValidator lengthRangeFieldValidator;
    private final AlphanumericWithDashFieldValidator alphanumericWithDashValidator;

    public UpdatedUserRequestedValidator(AlphanumericFieldValidator alphanumericValidator, LengthRangeFieldInfoValidator lengthRangeFieldValidator, AlphanumericWithDashFieldValidator alphanumericWithDashValidator) {
        this.alphanumericValidator = alphanumericValidator;
        this.lengthRangeFieldValidator = lengthRangeFieldValidator;
        this.alphanumericWithDashValidator = alphanumericWithDashValidator;
    }

    public void validate(UpdateUserRequest request) {
        if (Objects.isNull(request)) {
            throw new BadRequestException("UpdateUserRequest cannot be null");
        }

        validateField(request.getFirstName(), "firstName");
        validateField(request.getLastName(), "lastName");

        if (Objects.nonNull(request.getUserDetail())) {
            validateDetailField(request.getUserDetail().getPhone(), "userDetail.phone");
            validateDetailField(request.getUserDetail().getAddress(), "userDetail.address");
        }
    }

    private void validateField(String value, String path) {
        if (Objects.nonNull(value)) {
            alphanumericValidator.validate(value, path);
            lengthRangeFieldValidator.validate(value, path);
        }
    }

    private void validateDetailField(String value, String path) {
        if (Objects.nonNull(value)) {
            alphanumericWithDashValidator.validate(value, path);
            lengthRangeFieldValidator.validate(value, path);
        }
    }
}
