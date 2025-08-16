package ar.edu.itba.parkingmanagmentapi.validators;

import ar.edu.itba.parkingmanagmentapi.dto.ResetPasswordRequest;
import ar.edu.itba.parkingmanagmentapi.exceptions.BadRequestException;
import ar.edu.itba.parkingmanagmentapi.validators.common.BlankFieldValidator;
import ar.edu.itba.parkingmanagmentapi.validators.common.LengthRangeFieldPasswordValidator;
import ar.edu.itba.parkingmanagmentapi.validators.common.MandatoryFieldValidator;
import org.springframework.stereotype.Component;

import java.util.Objects;

@Component
public class ResetPasswordRequestValidator {
    private final MandatoryFieldValidator mandatoryFieldValidator;
    private final BlankFieldValidator blankFieldValidator;
    private final LengthRangeFieldPasswordValidator lengthRangeFieldPasswordValidator;

    public ResetPasswordRequestValidator(MandatoryFieldValidator mandatoryFieldValidator,
                                         BlankFieldValidator blankFieldValidator,
                                         LengthRangeFieldPasswordValidator lengthRangeFieldPasswordValidator) {
        this.mandatoryFieldValidator = mandatoryFieldValidator;
        this.blankFieldValidator = blankFieldValidator;
        this.lengthRangeFieldPasswordValidator = lengthRangeFieldPasswordValidator;
    }

    public void validate(ResetPasswordRequest request) {
        if (Objects.isNull(request)) {
            throw new BadRequestException("ResetPasswordRequest cannot be null");
        }
        mandatoryFieldValidator.validate(request.getToken(), "token");
        blankFieldValidator.validate(request.getToken(), "token");

        mandatoryFieldValidator.validate(request.getNewPassword(), "newPassword");
        blankFieldValidator.validate(request.getNewPassword(), "newPassword");
        lengthRangeFieldPasswordValidator.validate(request.getNewPassword(), "newPassword");
    }
}


