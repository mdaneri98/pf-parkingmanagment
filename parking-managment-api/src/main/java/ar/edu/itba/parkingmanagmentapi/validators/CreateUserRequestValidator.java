package ar.edu.itba.parkingmanagmentapi.validators;

import ar.edu.itba.parkingmanagmentapi.dto.CreateUserRequest;
import ar.edu.itba.parkingmanagmentapi.validators.common.AlphanumericEmailValidator;
import ar.edu.itba.parkingmanagmentapi.validators.common.BlankFieldValidator;
import ar.edu.itba.parkingmanagmentapi.validators.common.MandatoryFieldValidator;
import ar.edu.itba.parkingmanagmentapi.validators.common.MaxLengthFieldValidator;
import org.springframework.stereotype.Component;

@Component
public class CreateUserRequestValidator {
    private final MandatoryFieldValidator mandatoryFieldValidator;
    private final BlankFieldValidator blankFieldValidator;
    private final AlphanumericEmailValidator alphanumericEmailValidator;
    private final MaxLengthFieldValidator maxLengthValidator;

    public CreateUserRequestValidator(MandatoryFieldValidator mandatoryFieldValidator, BlankFieldValidator blankFieldValidator, AlphanumericEmailValidator alphanumericEmailValidator) {
        this.mandatoryFieldValidator = mandatoryFieldValidator;
        this.blankFieldValidator = blankFieldValidator;
        this.alphanumericEmailValidator = alphanumericEmailValidator;
        this.maxLengthValidator = new MaxLengthFieldValidator(20);
    }

    public void validate(CreateUserRequest userRequest) {
        mandatoryFieldValidator.validate(userRequest.getEmail(), "email");
        blankFieldValidator.validate(userRequest.getEmail(), "email");
        alphanumericEmailValidator.validate(userRequest.getEmail(), "email");
        maxLengthValidator.validate(userRequest.getEmail(), "email");

        mandatoryFieldValidator.validate(userRequest.getPassword(), "password");
        blankFieldValidator.validate(userRequest.getPassword(), "password");

    }
}
