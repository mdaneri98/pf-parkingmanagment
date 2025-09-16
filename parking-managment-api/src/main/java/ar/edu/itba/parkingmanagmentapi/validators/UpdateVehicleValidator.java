package ar.edu.itba.parkingmanagmentapi.validators;

import ar.edu.itba.parkingmanagmentapi.dto.VehicleRequest;
import ar.edu.itba.parkingmanagmentapi.dto.enums.VehicleType;
import ar.edu.itba.parkingmanagmentapi.exceptions.BadRequestException;
import ar.edu.itba.parkingmanagmentapi.validators.common.BlankFieldValidator;
import ar.edu.itba.parkingmanagmentapi.validators.common.LengthRangeFieldInfoValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Objects;

@Component
@RequiredArgsConstructor
public class UpdateVehicleValidator {
    private final BlankFieldValidator blankFieldValidator;
    private final LengthRangeFieldInfoValidator lengthRangeFieldInfoValidator;

    public void validate(VehicleRequest request) {
        if (Objects.isNull(request)) {
            throw new BadRequestException("VehicleRequest cannot be null");
        }

        validateField(request.getBrand(), "brand");
        validateField(request.getModel(), "model");
        boolean validType = Arrays.stream(VehicleType.values())
                .anyMatch(v -> v.getName().equalsIgnoreCase(request.getType()));
        if (!validType) {
            throw new BadRequestException("Invalid vehicleType");
        }
    }

    public void validateField(String value, String fieldName) {
        if (Objects.nonNull(value)) {
            blankFieldValidator.validate(value, fieldName);
            lengthRangeFieldInfoValidator.validate(value, fieldName);
        }
    }
}
