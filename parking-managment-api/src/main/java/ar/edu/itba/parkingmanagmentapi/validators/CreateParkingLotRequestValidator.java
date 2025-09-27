package ar.edu.itba.parkingmanagmentapi.validators;

import ar.edu.itba.parkingmanagmentapi.dto.ParkingLotRequest;
import ar.edu.itba.parkingmanagmentapi.exceptions.BadRequestException;
import ar.edu.itba.parkingmanagmentapi.validators.common.AlphanumericWithCommaFieldValidator;
import ar.edu.itba.parkingmanagmentapi.validators.common.BlankFieldValidator;
import ar.edu.itba.parkingmanagmentapi.validators.common.LengthRangeFieldInfoValidator;
import ar.edu.itba.parkingmanagmentapi.validators.common.MandatoryFieldValidator;
import org.springframework.stereotype.Component;

import java.util.Objects;

@Component
public class CreateParkingLotRequestValidator {
    private final MandatoryFieldValidator mandatoryFieldValidator;
    private final BlankFieldValidator blankFieldValidator;
    private final LengthRangeFieldInfoValidator lengthRangeFieldInfoValidator;
    private final AlphanumericWithCommaFieldValidator alphanumericValidator;
    private final SpotRequestValidator spotRequestValidator;

    public CreateParkingLotRequestValidator(MandatoryFieldValidator mandatoryFieldValidator, BlankFieldValidator blankFieldValidator, LengthRangeFieldInfoValidator lengthRangeFieldInfoValidator, AlphanumericWithCommaFieldValidator alphanumericValidator, SpotRequestValidator spotRequestValidator) {
        this.mandatoryFieldValidator = mandatoryFieldValidator;
        this.blankFieldValidator = blankFieldValidator;
        this.lengthRangeFieldInfoValidator = lengthRangeFieldInfoValidator;
        this.alphanumericValidator = alphanumericValidator;
        this.spotRequestValidator = spotRequestValidator;
    }

    public void validate(ParkingLotRequest parkingLotRequest) {
        if (Objects.isNull(parkingLotRequest)) {
            throw new BadRequestException("Parking lot cannot be null");
        }

        mandatoryFieldValidator.validate(parkingLotRequest.getName(), "name");
        blankFieldValidator.validate(parkingLotRequest.getName(), "name");
        lengthRangeFieldInfoValidator.validate(parkingLotRequest.getName(), "name");
        alphanumericValidator.validate(parkingLotRequest.getName(), "name");

        mandatoryFieldValidator.validate(parkingLotRequest.getAddress(), "address");
        blankFieldValidator.validate(parkingLotRequest.getAddress(), "address");
        lengthRangeFieldInfoValidator.validate(parkingLotRequest.getAddress(), "address");
        alphanumericValidator.validate(parkingLotRequest.getAddress(), "address");

        if (Objects.nonNull(parkingLotRequest.getImageUrl())) {
            blankFieldValidator.validate(parkingLotRequest.getImageUrl(), "imageUrl");
        }

        mandatoryFieldValidator.validate(parkingLotRequest.getLatitude(), "latitude");

        mandatoryFieldValidator.validate(parkingLotRequest.getLongitude(), "longitude");

        if (Objects.nonNull(parkingLotRequest.getSpots())) {
            parkingLotRequest.getSpots().forEach(spotRequestValidator::validate);
        }

    }
}
