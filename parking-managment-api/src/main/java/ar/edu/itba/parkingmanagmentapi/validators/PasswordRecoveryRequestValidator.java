package ar.edu.itba.parkingmanagmentapi.validators;

import ar.edu.itba.parkingmanagmentapi.dto.PasswordRecoveryRequest;
import ar.edu.itba.parkingmanagmentapi.exceptions.BadRequestException;
import ar.edu.itba.parkingmanagmentapi.validators.common.AlphanumericEmailValidator;
import ar.edu.itba.parkingmanagmentapi.validators.common.BlankFieldValidator;
import ar.edu.itba.parkingmanagmentapi.validators.common.LengthRangeFieldInfoValidator;
import ar.edu.itba.parkingmanagmentapi.validators.common.MandatoryFieldValidator;
import org.springframework.stereotype.Component;

import java.util.Objects;

@Component
public class PasswordRecoveryRequestValidator {
    private final MandatoryFieldValidator mandatoryFieldValidator;
    private final BlankFieldValidator blankFieldValidator;
    private final AlphanumericEmailValidator alphanumericEmailValidator;
    private final LengthRangeFieldInfoValidator lengthRangeFieldInfoValidator;

    public PasswordRecoveryRequestValidator(MandatoryFieldValidator mandatoryFieldValidator,
                                            BlankFieldValidator blankFieldValidator,
                                            AlphanumericEmailValidator alphanumericEmailValidator,
                                            LengthRangeFieldInfoValidator lengthRangeFieldInfoValidator) {
        this.mandatoryFieldValidator = mandatoryFieldValidator;
        this.blankFieldValidator = blankFieldValidator;
        this.alphanumericEmailValidator = alphanumericEmailValidator;
        this.lengthRangeFieldInfoValidator = lengthRangeFieldInfoValidator;
    }

    public void validate(PasswordRecoveryRequest request) {
        if (Objects.isNull(request)) {
            throw new BadRequestException("PasswordRecoveryRequest cannot be null");
        }
        mandatoryFieldValidator.validate(request.getEmail(), "email");
        blankFieldValidator.validate(request.getEmail(), "email");
        alphanumericEmailValidator.validate(request.getEmail(), "email");
        lengthRangeFieldInfoValidator.validate(request.getEmail(), "email");
    }
}


