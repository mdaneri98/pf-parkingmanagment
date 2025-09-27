package ar.edu.itba.parkingmanagmentapi.validators;

import ar.edu.itba.parkingmanagmentapi.dto.UpdateParkingLotRequest;
import ar.edu.itba.parkingmanagmentapi.exceptions.BadRequestException;
import ar.edu.itba.parkingmanagmentapi.validators.common.AlphanumericWithCommaFieldValidator;
import ar.edu.itba.parkingmanagmentapi.validators.common.BlankFieldValidator;
import ar.edu.itba.parkingmanagmentapi.validators.common.LengthRangeFieldInfoValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Objects;

@Component
@RequiredArgsConstructor
public class UpdateParkingLotRequestValidator {
    private final BlankFieldValidator blankFieldValidator;
    private final LengthRangeFieldInfoValidator lengthRangeFieldInfoValidator;
    private final AlphanumericWithCommaFieldValidator alphanumericValidator;

    public void validate(UpdateParkingLotRequest parkingLotRequest) {
        if (parkingLotRequest == null) {
            throw new BadRequestException("Parking lot request cannot be null");
        }

        validateField(parkingLotRequest.getName(), "name");
        validateField(parkingLotRequest.getAddress(), "address");

        if (Objects.nonNull(parkingLotRequest.getImageUrl())) {
            blankFieldValidator.validate(parkingLotRequest.getImageUrl(), "imageUrl");
        }
    }

    private void validateField(String value, String path) {
        if (Objects.nonNull(value)) {
            blankFieldValidator.validate(value, path);
            alphanumericValidator.validate(value, path);
            lengthRangeFieldInfoValidator.validate(value, path);
        }
    }
}
