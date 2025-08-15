package ar.edu.itba.parkingmanagmentapi.validators;

import ar.edu.itba.parkingmanagmentapi.dto.ParkingLotRequest;
import ar.edu.itba.parkingmanagmentapi.exceptions.BadRequestException;
import ar.edu.itba.parkingmanagmentapi.validators.common.*;
import org.springframework.stereotype.Component;

import java.util.Objects;

@Component
public class CreateParkingLotRequest {
    private final MandatoryFieldValidator mandatoryFieldValidator;
    private final BlankFieldValidator blankFieldValidator;
    private final LengthRangeFieldInfoValidator lengthRangeFieldInfoValidator;
    private final AlphanumericWithDashFieldValidator alphanumericValidator;
    private final NonEmptyCollectionValidator nonEmptyCollectionValidator;

    public CreateParkingLotRequest(MandatoryFieldValidator mandatoryFieldValidator, BlankFieldValidator blankFieldValidator, LengthRangeFieldInfoValidator lengthRangeFieldInfoValidator, AlphanumericWithDashFieldValidator alphanumericValidator, NonEmptyCollectionValidator nonEmptyCollectionValidator) {
        this.mandatoryFieldValidator = mandatoryFieldValidator;
        this.blankFieldValidator = blankFieldValidator;
        this.lengthRangeFieldInfoValidator = lengthRangeFieldInfoValidator;
        this.alphanumericValidator = alphanumericValidator;
        this.nonEmptyCollectionValidator = nonEmptyCollectionValidator;
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

        mandatoryFieldValidator.validate(parkingLotRequest.getManagerId(), "managerId");

        mandatoryFieldValidator.validate(parkingLotRequest.getSpots(), "spots");
        nonEmptyCollectionValidator.validate(parkingLotRequest.getSpots(), "spots");

    }
}
