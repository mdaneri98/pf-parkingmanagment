package ar.edu.itba.parkingmanagmentapi.validators;

import ar.edu.itba.parkingmanagmentapi.dto.UpdateUserRequest;
import ar.edu.itba.parkingmanagmentapi.exceptions.BadRequestException;
import ar.edu.itba.parkingmanagmentapi.validators.common.AlphanumericFieldValidator;
import ar.edu.itba.parkingmanagmentapi.validators.common.AlphanumericWithCommaFieldValidator;
import ar.edu.itba.parkingmanagmentapi.validators.common.LengthRangeFieldInfoValidator;
import ar.edu.itba.parkingmanagmentapi.validators.common.PhoneFieldValidator;
import org.springframework.stereotype.Component;

import java.util.Objects;

@Component
public class UpdatedUserRequestedValidator {
    private final PhoneFieldValidator phoneFieldValidator;
    private final AlphanumericFieldValidator alphanumericValidator;
    private final LengthRangeFieldInfoValidator lengthRangeFieldValidator;
    private final AlphanumericWithCommaFieldValidator alphanumericWithDashValidator;

    public UpdatedUserRequestedValidator(PhoneFieldValidator phoneFieldValidator, AlphanumericFieldValidator alphanumericValidator, LengthRangeFieldInfoValidator lengthRangeFieldValidator, AlphanumericWithCommaFieldValidator alphanumericWithDashValidator) {
        this.phoneFieldValidator = phoneFieldValidator;
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
            validatePhoneField(request.getUserDetail().getPhone());
            validateAddressField(request.getUserDetail().getAddress());
        }
    }

    private void validateField(String value, String path) {
        if (Objects.nonNull(value)) {
            alphanumericValidator.validate(value, path);
            lengthRangeFieldValidator.validate(value, path);
        }
    }

    private void validatePhoneField(String value) {
        if (Objects.nonNull(value)) {
            phoneFieldValidator.validate(value, "userDetail.phone");
            lengthRangeFieldValidator.validate(value, "userDetail.phone");
        }
    }

    private void validateAddressField(String value) {
        if (Objects.nonNull(value)) {
            alphanumericWithDashValidator.validate(value, "userDetail.address");
            lengthRangeFieldValidator.validate(value, "userDetail.address");
        }
    }
}
