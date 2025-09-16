package ar.edu.itba.parkingmanagmentapi.validators;

import ar.edu.itba.parkingmanagmentapi.dto.ParkingPriceRequest;
import ar.edu.itba.parkingmanagmentapi.dto.enums.VehicleType;
import ar.edu.itba.parkingmanagmentapi.exceptions.BadRequestException;
import ar.edu.itba.parkingmanagmentapi.validators.common.BlankFieldValidator;
import ar.edu.itba.parkingmanagmentapi.validators.common.MandatoryFieldValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Arrays;

@Component
@RequiredArgsConstructor
public class ParkingPriceRequestValidator {
    private final MandatoryFieldValidator mandatoryFieldValidator;
    private final BlankFieldValidator blankFieldValidator;

    public void validate(ParkingPriceRequest parkingPriceRequest) {
        if (parkingPriceRequest == null) {
            throw new BadRequestException("ParkingPriceRequest cannot be null");
        }

        mandatoryFieldValidator.validate(parkingPriceRequest.getVehicleType(), "vehicleType");
        blankFieldValidator.validate(parkingPriceRequest.getVehicleType(), "vehicleType");
        boolean validType = Arrays.stream(VehicleType.values())
                .anyMatch(v -> v.getName().equalsIgnoreCase(parkingPriceRequest.getVehicleType()));
        if (!validType) {
            throw new BadRequestException("Invalid vehicleType");
        }

        mandatoryFieldValidator.validate(parkingPriceRequest.getPrice(), "price");
        if (parkingPriceRequest.getPrice().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Price must be greater than zero");
        }

        mandatoryFieldValidator.validate(parkingPriceRequest.getValidFrom(), "validFrom");

        if (parkingPriceRequest.getValidTo() != null && parkingPriceRequest.getValidFrom().isAfter(parkingPriceRequest.getValidTo())) {
            throw new BadRequestException("ValidFrom must be before validTo");
        }
    }
}
