package ar.edu.itba.parkingmanagmentapi.validators;

import ar.edu.itba.parkingmanagmentapi.dto.VehicleRequest;
import ar.edu.itba.parkingmanagmentapi.dto.enums.VehicleType;
import ar.edu.itba.parkingmanagmentapi.exceptions.BadRequestException;
import ar.edu.itba.parkingmanagmentapi.validators.common.AlphanumericLicensePlateValidator;
import ar.edu.itba.parkingmanagmentapi.validators.common.BlankFieldValidator;
import ar.edu.itba.parkingmanagmentapi.validators.common.LengthRangeFieldInfoValidator;
import ar.edu.itba.parkingmanagmentapi.validators.common.MandatoryFieldValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
@RequiredArgsConstructor
public class CreateVehicleValidator {
    private final MandatoryFieldValidator mandatoryFieldValidator;
    private final BlankFieldValidator blankFieldValidator;
    private final LengthRangeFieldInfoValidator lengthRangeFieldInfoValidator;
    private final AlphanumericLicensePlateValidator alphanumericValidator;

    public void validate(VehicleRequest vehicleRequest) {
        if (vehicleRequest == null) {
            throw new IllegalArgumentException("Vehicle request cannot be null");
        }

        mandatoryFieldValidator.validate(vehicleRequest.getLicensePlate(), "licensePlate");
        blankFieldValidator.validate(vehicleRequest.getLicensePlate(), "licensePlate");
        lengthRangeFieldInfoValidator.validate(vehicleRequest.getLicensePlate(), "licensePlate");
        alphanumericValidator.validate(vehicleRequest.getLicensePlate(), "licensePlate");

        blankFieldValidator.validate(vehicleRequest.getBrand(), "brand");
        lengthRangeFieldInfoValidator.validate(vehicleRequest.getBrand(), "brand");

        blankFieldValidator.validate(vehicleRequest.getModel(), "model");
        lengthRangeFieldInfoValidator.validate(vehicleRequest.getModel(), "model");

        mandatoryFieldValidator.validate(vehicleRequest.getType(), "type");
        boolean validType = Arrays.stream(VehicleType.values())
                .anyMatch(v -> v.getName().equalsIgnoreCase(vehicleRequest.getType()));
        if (!validType) {
            throw new BadRequestException("Invalid vehicleType");
        }

    }
}
