package ar.edu.itba.parkingmanagmentapi.validators;

import ar.edu.itba.parkingmanagmentapi.dto.SpotRequest;
import ar.edu.itba.parkingmanagmentapi.dto.enums.VehicleType;
import ar.edu.itba.parkingmanagmentapi.exceptions.BadRequestException;
import ar.edu.itba.parkingmanagmentapi.validators.common.AlphanumericWithCommaFieldValidator;
import ar.edu.itba.parkingmanagmentapi.validators.common.BlankFieldValidator;
import ar.edu.itba.parkingmanagmentapi.validators.common.MandatoryFieldValidator;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Locale;

@Component
public class SpotRequestValidator {

    private final MandatoryFieldValidator mandatoryFieldValidator;
    private final BlankFieldValidator blankFieldValidator;
    private final AlphanumericWithCommaFieldValidator alphanumericValidator;

    public SpotRequestValidator(MandatoryFieldValidator mandatoryFieldValidator,
                                BlankFieldValidator blankFieldValidator,
                                AlphanumericWithCommaFieldValidator alphanumericValidator) {
        this.mandatoryFieldValidator = mandatoryFieldValidator;
        this.blankFieldValidator = blankFieldValidator;
        this.alphanumericValidator = alphanumericValidator;
    }

    public void validate(SpotRequest spotRequest) {
        mandatoryFieldValidator.validate(spotRequest.getVehicleType(), "vehicleType");
        boolean validType = Arrays.stream(VehicleType.values())
                .anyMatch(v -> v.getName().equalsIgnoreCase(spotRequest.getVehicleType()));
        if (!validType) {
            throw new BadRequestException("Invalid vehicleType");
        }

        mandatoryFieldValidator.validate(spotRequest.getFloor(), "floor");

        mandatoryFieldValidator.validate(spotRequest.getCode(), "code");
        blankFieldValidator.validate(spotRequest.getCode(), "code");
        alphanumericValidator.validate(spotRequest.getCode(), "code");
        spotRequest.setCode(spotRequest.getCode().toUpperCase(Locale.ROOT));
    }
}
