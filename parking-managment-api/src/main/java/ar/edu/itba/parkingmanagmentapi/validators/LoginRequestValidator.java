package ar.edu.itba.parkingmanagmentapi.validators;

import ar.edu.itba.parkingmanagmentapi.dto.LoginRequest;
import ar.edu.itba.parkingmanagmentapi.validators.common.AlphanumericEmailValidator;
import ar.edu.itba.parkingmanagmentapi.validators.common.BlankFieldValidator;
import ar.edu.itba.parkingmanagmentapi.validators.common.MandatoryFieldValidator;
import org.springframework.stereotype.Component;

@Component
public class LoginRequestValidator {
    private final MandatoryFieldValidator mandatoryFieldValidator;
    private final BlankFieldValidator blankFieldValidator;
    private final AlphanumericEmailValidator alphanumericEmailValidator;

    public LoginRequestValidator(MandatoryFieldValidator mandatoryFieldValidator,
                                 BlankFieldValidator blankFieldValidator,
                                 AlphanumericEmailValidator alphanumericEmailValidator) {
        this.mandatoryFieldValidator = mandatoryFieldValidator;
        this.blankFieldValidator = blankFieldValidator;
        this.alphanumericEmailValidator = alphanumericEmailValidator;
    }

    public void validate(LoginRequest loginRequest) {
        validateEmail(loginRequest.getEmail());
        validatePassword(loginRequest.getPassword());
    }

    private void validateEmail(String email) {
        mandatoryFieldValidator.validate(email);
        blankFieldValidator.validate(email);
        alphanumericEmailValidator.validate(email);
    }

    private void validatePassword(String password) {
        mandatoryFieldValidator.validate(password);
        blankFieldValidator.validate(password);
    }
}
