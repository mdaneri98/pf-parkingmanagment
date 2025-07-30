package ar.edu.itba.parkingmanagmentapi.validators;

import ar.edu.itba.parkingmanagmentapi.dto.CreateUserRequest;
import ar.edu.itba.parkingmanagmentapi.validators.common.*;
import org.springframework.stereotype.Component;

@Component
public class CreateUserRequestValidator {
    private final MandatoryFieldValidator mandatoryFieldValidator;
    private final BlankFieldValidator blankFieldValidator;
    private final AlphanumericEmailValidator alphanumericEmailValidator;
    private final LengthRangeFieldPasswordValidator lengthRangeFieldPasswordValidator;
    private final LengthRangeFieldInfoValidator lengthRangeFieldInfoValidator;

    public CreateUserRequestValidator(MandatoryFieldValidator mandatoryFieldValidator, BlankFieldValidator blankFieldValidator, AlphanumericEmailValidator alphanumericEmailValidator, LengthRangeFieldPasswordValidator lengthRangeFieldPasswordValidator, LengthRangeFieldInfoValidator lengthRangeFieldInfoValidator) {
        this.mandatoryFieldValidator = mandatoryFieldValidator;
        this.blankFieldValidator = blankFieldValidator;
        this.alphanumericEmailValidator = alphanumericEmailValidator;
        this.lengthRangeFieldPasswordValidator = lengthRangeFieldPasswordValidator;
        this.lengthRangeFieldInfoValidator = lengthRangeFieldInfoValidator;
    }

    public void validate(CreateUserRequest userRequest) {
        mandatoryFieldValidator.validate(userRequest.getEmail(), "email");
        blankFieldValidator.validate(userRequest.getEmail(), "email");
        alphanumericEmailValidator.validate(userRequest.getEmail(), "email");
        lengthRangeFieldInfoValidator.validate(userRequest.getEmail(), "email");

        mandatoryFieldValidator.validate(userRequest.getPassword(), "password");
        blankFieldValidator.validate(userRequest.getPassword(), "password");
        mandatoryFieldValidator.validate(userRequest.getPassword(), "password");
        lengthRangeFieldPasswordValidator.validate(userRequest.getPassword(), "password");

    }
}
