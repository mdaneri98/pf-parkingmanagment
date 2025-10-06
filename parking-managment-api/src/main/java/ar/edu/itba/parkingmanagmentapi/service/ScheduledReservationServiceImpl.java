package ar.edu.itba.parkingmanagmentapi.service;

import ar.edu.itba.parkingmanagmentapi.dto.ReservationResponse;
import ar.edu.itba.parkingmanagmentapi.dto.ScheduledReservationRequest;
import ar.edu.itba.parkingmanagmentapi.dto.enums.ReservationStatus;
import ar.edu.itba.parkingmanagmentapi.exceptions.BadRequestException;
import ar.edu.itba.parkingmanagmentapi.exceptions.NotFoundException;
import ar.edu.itba.parkingmanagmentapi.model.ScheduledReservation;
import ar.edu.itba.parkingmanagmentapi.model.Spot;
import ar.edu.itba.parkingmanagmentapi.repository.*;
import ar.edu.itba.parkingmanagmentapi.validators.ScheduledReservationRequestValidator;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ScheduledReservationServiceImpl extends ReservationServiceImpl<ScheduledReservationRequest> implements ScheduledReservationService {

    private final ScheduledReservationRequestValidator scheduledReservationRequestValidator;

    protected ScheduledReservationServiceImpl(
            SpotRepository spotRepository,
            ParkingPriceRepository parkingPriceRepository,
            UserVehicleAssignmentRepository userVehicleAssignmentRepository,
            ScheduledReservationRepository scheduledReservationRepository,
            ScheduledReservationRequestValidator scheduledReservationRequestValidator,
            WalkInStayRepository walkInStayRepository) {
        super(spotRepository, parkingPriceRepository, userVehicleAssignmentRepository, walkInStayRepository, scheduledReservationRepository);
        this.scheduledReservationRequestValidator = scheduledReservationRequestValidator;
    }

    @Override
    public ReservationResponse createReservation(ScheduledReservationRequest request) {
        scheduledReservationRequestValidator.validate(request);
        Spot spot = getSpotById(request.getSpotId());

        boolean hasActiveWalkIn = walkInStayRepository.existsBySpotAndCheckOutTimeIsNull(spot);
        if (hasActiveWalkIn) {
            throw new BadRequestException("The spot is currently occupied by a walk-in stay");
        }

        List<ScheduledReservation> overlapping = reservationRepository
                .findBySpotAndReservedStartTimeLessThanEqualAndExpectedEndTimeGreaterThanEqual(
                        spot, request.getReservedStartTime(), request.getExpectedEndTime());
        if (!overlapping.isEmpty()) {
            throw new BadRequestException("The spot is already reserved in that time range");
        }

        BigDecimal estimatedPrice = calculateEstimatedPrice(spot, request.getReservedStartTime(), request.getExpectedEndTime());

        ScheduledReservation reservation = new ScheduledReservation();
        reservation.setReservedStartTime(request.getReservedStartTime());
        reservation.setExpectedEndTime(request.getExpectedEndTime());
        reservation.setEstimatedPrice(estimatedPrice);
        reservation.setStatus(ReservationStatus.PENDING);
        reservation.setSpot(spot);
        reservation.setUserVehicleAssignment(verifyUserVehicleAssignment(request.getUserId(), request.getVehicleLicensePlate()));

        reservationRepository.save(reservation);
        return ReservationResponse.fromScheduledReservation(reservation);
    }

    @Override
    public ReservationResponse getReservation(Long id) {
        ScheduledReservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Reservation with id " + id + " not found"));
        return ReservationResponse.fromScheduledReservation(reservation);
    }

    @Override
    public ReservationResponse updateReservationStatus(Long id, ReservationStatus status) {
        ScheduledReservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Reservation with id " + id + " not found"));

        reservation.setStatus(status);
        reservationRepository.save(reservation);

        return ReservationResponse.fromScheduledReservation(reservation);
    }

    @Override
    public Page<ReservationResponse> getReservationsByUser(Long userId, ReservationStatus status, String vehiclePlate, LocalDateTime from, LocalDateTime to, Pageable pageable) {
        return reservationRepository.findAll(ScheduledReservationSpecifications.withFilters(userId, null, status, vehiclePlate, from, to), pageable)
                .map(ReservationResponse::fromScheduledReservation);
    }

    @Override
    public Page<ReservationResponse> getScheduledReservationsByParkingLot(Long parkingLotId, ReservationStatus status, LocalDateTime from, LocalDateTime to, Pageable pageable) {
        return reservationRepository.findAll(ScheduledReservationSpecifications.withFilters(null, parkingLotId, status, null, from, to), pageable)
                .map(ReservationResponse::fromScheduledReservation);
    }

    @Override
    public List<ReservationResponse> checkInReservation(LocalDateTime checkInTime) {
        List<ScheduledReservation> reservations = reservationRepository
                .findByStatusAndReservedStartTimeLessThanEqual(ReservationStatus.PENDING, checkInTime);

        for (ScheduledReservation reservation : reservations) {
            Spot spot = reservation.getSpot();
            if (spot.getIsAvailable()) {
                spot.setIsAvailable(false);
                reservation.setStatus(ReservationStatus.ACTIVE);
                spotRepository.save(spot);
                reservationRepository.save(reservation);
            }
        }

        return reservations.stream().map(ReservationResponse::fromScheduledReservation).toList();
    }

}
