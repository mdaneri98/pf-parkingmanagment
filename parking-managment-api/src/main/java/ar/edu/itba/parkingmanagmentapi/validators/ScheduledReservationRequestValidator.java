package ar.edu.itba.parkingmanagmentapi.validators;

import ar.edu.itba.parkingmanagmentapi.dto.ScheduledReservationRequest;
import ar.edu.itba.parkingmanagmentapi.validators.common.AlphanumericLicensePlateValidator;
import ar.edu.itba.parkingmanagmentapi.validators.common.BlankFieldValidator;
import ar.edu.itba.parkingmanagmentapi.validators.common.LengthRangeFieldInfoValidator;
import ar.edu.itba.parkingmanagmentapi.validators.common.MandatoryFieldValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ScheduledReservationRequestValidator {
    private final MandatoryFieldValidator mandatoryFieldValidator;
    private final BlankFieldValidator blankFieldValidator;
    private final LengthRangeFieldInfoValidator lengthRangeFieldInfoValidator;
    private final AlphanumericLicensePlateValidator alphanumericValidator;

    public void validate(ScheduledReservationRequest reservationRequest) {
        if (reservationRequest == null) {
            throw new IllegalArgumentException("Reservation request cannot be null");
        }
        validateMandatoryFields(reservationRequest);
        validateBlankFields(reservationRequest);
        validateFieldLengths(reservationRequest);
        validateAlphanumericFields(reservationRequest);
        validateLogicalConsistency(reservationRequest);
    }

    private void validateMandatoryFields(ScheduledReservationRequest reservationRequest) {
        mandatoryFieldValidator.validate(reservationRequest.getUserId(), "userId");
        mandatoryFieldValidator.validate(reservationRequest.getSpotId(), "spotId");
        mandatoryFieldValidator.validate(reservationRequest.getReservedStartTime(), "reservedStartTime");
        mandatoryFieldValidator.validate(reservationRequest.getExpectedEndTime(), "expectedEndTime");
        mandatoryFieldValidator.validate(reservationRequest.getVehicleLicensePlate(), "vehicleLicensePlate");
    }

    private void validateBlankFields(ScheduledReservationRequest reservationRequest) {
        blankFieldValidator.validate(reservationRequest.getVehicleLicensePlate(), "vehicleLicensePlate");
    }

    private void validateFieldLengths(ScheduledReservationRequest reservationRequest) {
        lengthRangeFieldInfoValidator.validate(reservationRequest.getVehicleLicensePlate(), "vehicleLicensePlate");
    }

    private void validateAlphanumericFields(ScheduledReservationRequest reservationRequest) {
        alphanumericValidator.validate(reservationRequest.getVehicleLicensePlate(), "vehicleLicensePlate");
    }

    private void validateLogicalConsistency(ScheduledReservationRequest reservationRequest) {
        if (reservationRequest.getExpectedEndTime().isBefore(reservationRequest.getReservedStartTime())) {
            throw new IllegalArgumentException("Expected end time cannot be before reserved start time");
        }
    }
}
