package ar.edu.itba.parkingmanagmentapi.validators;

import ar.edu.itba.parkingmanagmentapi.dto.LoginRequest;
import ar.edu.itba.parkingmanagmentapi.validators.common.*;
import org.springframework.stereotype.Component;

@Component
public class LoginRequestValidator {
    private final MandatoryFieldValidator mandatoryFieldValidator;
    private final BlankFieldValidator blankFieldValidator;
    private final AlphanumericEmailValidator alphanumericEmailValidator;

    private final LengthRangeFieldPasswordValidator lengthRangeFieldPasswordValidator;

    private final LengthRangeFieldInfoValidator lengthRangeFieldInfoValidator;

    public LoginRequestValidator(MandatoryFieldValidator mandatoryFieldValidator,
                                 BlankFieldValidator blankFieldValidator,
                                 AlphanumericEmailValidator alphanumericEmailValidator,
                                 LengthRangeFieldPasswordValidator lengthRangeFieldPasswordValidator,
                                 LengthRangeFieldInfoValidator lengthRangeFieldInfoValidator) {
        this.mandatoryFieldValidator = mandatoryFieldValidator;
        this.blankFieldValidator = blankFieldValidator;
        this.alphanumericEmailValidator = alphanumericEmailValidator;
        this.lengthRangeFieldPasswordValidator = lengthRangeFieldPasswordValidator;
        this.lengthRangeFieldInfoValidator = lengthRangeFieldInfoValidator;
    }

    public void validate(LoginRequest loginRequest) {
        validateEmail(loginRequest.getEmail());
        validatePassword(loginRequest.getPassword());
    }

    private void validateEmail(String email) {
        mandatoryFieldValidator.validate(email);
        blankFieldValidator.validate(email);
        alphanumericEmailValidator.validate(email);
        lengthRangeFieldInfoValidator.validate(email);
    }

    private void validatePassword(String password) {
        mandatoryFieldValidator.validate(password);
        blankFieldValidator.validate(password);
        lengthRangeFieldPasswordValidator.validate(password);
    }
}
