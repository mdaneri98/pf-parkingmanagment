package ar.edu.itba.parkingmanagmentapi.validators;

import ar.edu.itba.parkingmanagmentapi.dto.WalkInStayRequest;
import ar.edu.itba.parkingmanagmentapi.validators.common.AlphanumericLicensePlateValidator;
import ar.edu.itba.parkingmanagmentapi.validators.common.BlankFieldValidator;
import ar.edu.itba.parkingmanagmentapi.validators.common.LengthRangeFieldInfoValidator;
import ar.edu.itba.parkingmanagmentapi.validators.common.MandatoryFieldValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class WalkInStayRequestValidator {
    private final MandatoryFieldValidator mandatoryFieldValidator;
    private final BlankFieldValidator blankFieldValidator;
    private final LengthRangeFieldInfoValidator lengthRangeFieldInfoValidator;
    private final AlphanumericLicensePlateValidator alphanumericValidator;

    public void validate(WalkInStayRequest walkInStayRequest) {
        if (walkInStayRequest == null) {
            throw new IllegalArgumentException("Walk-in stay request cannot be null");
        }

        mandatoryFieldValidator.validate(walkInStayRequest.getSpotId(), "spotId");

        mandatoryFieldValidator.validate(walkInStayRequest.getVehicleLicensePlate(), "vehicleLicensePlate");
        blankFieldValidator.validate(walkInStayRequest.getVehicleLicensePlate(), "vehicleLicensePlate");
        lengthRangeFieldInfoValidator.validate(walkInStayRequest.getVehicleLicensePlate(), "vehicleLicensePlate");
        alphanumericValidator.validate(walkInStayRequest.getVehicleLicensePlate(), "vehicleLicensePlate");

        if (walkInStayRequest.getExpectedDurationHours() != null && walkInStayRequest.getExpectedDurationHours() <= 0) {
            throw new IllegalArgumentException("Expected duration hours must be greater than zero");
        }

    }

}
