package ar.edu.itba.parkingmanagmentapi.validators;

import ar.edu.itba.parkingmanagmentapi.dto.RegisterRequest;
import ar.edu.itba.parkingmanagmentapi.validators.common.*;
import org.springframework.stereotype.Component;

@Component
public class RegisterRequestValidator {
    private final MandatoryFieldValidator mandatoryFieldValidator;
    private final BlankFieldValidator blankFieldValidator;
    private final AlphanumericEmailValidator alphanumericEmailValidator;
    private final LengthRangeFieldInfoValidator lengthRangeFieldInfoValidator;

    private final LengthRangeFieldPasswordValidator lengthRangeFieldPasswordValidator;

    public RegisterRequestValidator(MandatoryFieldValidator mandatoryFieldValidator, BlankFieldValidator blankFieldValidator, AlphanumericEmailValidator alphanumericEmailValidator, LengthRangeFieldInfoValidator lengthRangeFieldInfoValidator, LengthRangeFieldPasswordValidator lengthRangeFieldPasswordValidator) {
        this.mandatoryFieldValidator = mandatoryFieldValidator;
        this.blankFieldValidator = blankFieldValidator;
        this.alphanumericEmailValidator = alphanumericEmailValidator;
        this.lengthRangeFieldInfoValidator = lengthRangeFieldInfoValidator;
        this.lengthRangeFieldPasswordValidator = lengthRangeFieldPasswordValidator;
    }

    public void validate(RegisterRequest registerRequest) {
        mandatoryFieldValidator.validate(registerRequest.getEmail(), "email");
        blankFieldValidator.validate(registerRequest.getEmail(), "email");
        alphanumericEmailValidator.validate(registerRequest.getEmail(), "email");
        lengthRangeFieldInfoValidator.validate(registerRequest.getEmail(), "email");

        mandatoryFieldValidator.validate(registerRequest.getPassword(), "password");
        blankFieldValidator.validate(registerRequest.getPassword(), "password");
        lengthRangeFieldPasswordValidator.validate(registerRequest.getPassword(), "password");

        mandatoryFieldValidator.validate(registerRequest.getFirstName(), "firstName");
        blankFieldValidator.validate(registerRequest.getFirstName(), "firstName");
        lengthRangeFieldInfoValidator.validate(registerRequest.getFirstName(), "firstName");

        mandatoryFieldValidator.validate(registerRequest.getLastName(), "lastName");
        blankFieldValidator.validate(registerRequest.getLastName(), "lastName");
        lengthRangeFieldInfoValidator.validate(registerRequest.getLastName(), "lastName");
    }
}
