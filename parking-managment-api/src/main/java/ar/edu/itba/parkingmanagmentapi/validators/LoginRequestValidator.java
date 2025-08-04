package ar.edu.itba.parkingmanagmentapi.validators;

import ar.edu.itba.parkingmanagmentapi.dto.LoginRequest;
import ar.edu.itba.parkingmanagmentapi.exceptions.BadRequestException;
import ar.edu.itba.parkingmanagmentapi.validators.common.*;
import org.springframework.stereotype.Component;

import java.util.Objects;

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
        if (Objects.isNull(loginRequest)) {
            throw new BadRequestException("LoginRequest cannot be null");
        }
        validateEmail(loginRequest.getEmail());
        validatePassword(loginRequest.getPassword());
    }

    private void validateEmail(String email) {
        mandatoryFieldValidator.validate(email,"email");
        blankFieldValidator.validate(email,"email");
        alphanumericEmailValidator.validate(email, "email");
        lengthRangeFieldInfoValidator.validate(email, "email");
    }

    private void validatePassword(String password) {
        mandatoryFieldValidator.validate(password, "password");
        blankFieldValidator.validate(password,  "password");
        lengthRangeFieldPasswordValidator.validate(password,  "password");
    }
}
