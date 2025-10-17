package ar.edu.itba.parkingmanagmentapi.service;

import ar.edu.itba.parkingmanagmentapi.config.AppConstants;
import ar.edu.itba.parkingmanagmentapi.dto.ReservationResponse;
import ar.edu.itba.parkingmanagmentapi.dto.ScheduledReservationRequest;
import ar.edu.itba.parkingmanagmentapi.dto.enums.ReservationStatus;
import ar.edu.itba.parkingmanagmentapi.exceptions.BadRequestException;
import ar.edu.itba.parkingmanagmentapi.exceptions.NotFoundException;
import ar.edu.itba.parkingmanagmentapi.model.ScheduledReservation;
import ar.edu.itba.parkingmanagmentapi.model.Spot;
import ar.edu.itba.parkingmanagmentapi.model.UserVehicleAssignment;
import ar.edu.itba.parkingmanagmentapi.model.Vehicle;
import ar.edu.itba.parkingmanagmentapi.repository.ParkingPriceRepository;
import ar.edu.itba.parkingmanagmentapi.repository.ScheduledReservationRepository;
import ar.edu.itba.parkingmanagmentapi.repository.ScheduledReservationSpecifications;
import ar.edu.itba.parkingmanagmentapi.repository.WalkInStayRepository;
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
            SpotService spotService,
            ParkingPriceRepository parkingPriceRepository,
            ScheduledReservationRepository reservationRepository,
            VehicleService vehicleService,
            WalkInStayRepository walkInStayRepository,
            ScheduledReservationRequestValidator scheduledReservationRequestValidator,
            UserVehicleAssignmentService userVehicleAssignmentService) {
        super(spotService, parkingPriceRepository, vehicleService, walkInStayRepository, reservationRepository, userVehicleAssignmentService);
        this.scheduledReservationRequestValidator = scheduledReservationRequestValidator;
    }

    @Override
    public ReservationResponse createReservation(ScheduledReservationRequest request) {
        scheduledReservationRequestValidator.validate(request);

        Spot spot = spotService.findEntityById(request.getSpotId());

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

        UserVehicleAssignment assignment = findOrCreateVehicleAssignment(request.getVehicleLicensePlate(), spot.getVehicleType());

        LocalDateTime now = LocalDateTime.now();
        ScheduledReservation reservation = new ScheduledReservation();
        reservation.setReservedStartTime(request.getReservedStartTime());
        reservation.setCreatedAt(now);
        reservation.setUpdatedAt(now);
        reservation.setExpectedEndTime(request.getExpectedEndTime());
        reservation.setEstimatedPrice(estimatedPrice);
        reservation.setStatus(ReservationStatus.PENDING);
        reservation.setSpot(spot);
        reservation.setUserVehicleAssignment(assignment);


        reservationRepository.save(reservation);
        return ReservationResponse.fromScheduledReservation(reservation);
    }

    @Override
    public ReservationResponse getReservation(Long id) {
        ScheduledReservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Reservation with id " + id + " not found"));
        return ReservationResponse.fromEntityToGet(reservation);
    }

    @Override
    public ReservationResponse updateReservationStatus(Long id, ReservationStatus status) {
        ScheduledReservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Reservation with id " + id + " not found"));

        if (status == ReservationStatus.COMPLETED) {
            findSpotAndChangeAvailability(reservation.getSpot().getId(), true);
        }

        reservation.setStatus(status);
        reservationRepository.save(reservation);

        return ReservationResponse.fromEntityToGet(reservation);
    }

    @Override
    public Page<ReservationResponse> getReservationsByUser(Long userId, ReservationStatus status, String vehiclePlate, LocalDateTime from, LocalDateTime to, Pageable pageable) {
        return reservationRepository.findAll(ScheduledReservationSpecifications.withFilters(userId, null, status, vehiclePlate, from, to), pageable)
                .map(ReservationResponse::fromEntityToGet);
    }

    @Override
    public Page<ReservationResponse> getReservationsByParkingLot(Long parkingLotId, ReservationStatus status, String licensePlate, LocalDateTime from, LocalDateTime to, Pageable pageable) {
        return reservationRepository.findAll(ScheduledReservationSpecifications.withFilters(null, parkingLotId, status, null, from, to), pageable)
                .map(ReservationResponse::fromEntityToGet);
    }

    @Override
    public List<ReservationResponse> checkInReservation(LocalDateTime checkInTime) {
        List<ScheduledReservation> reservations = reservationRepository
                .findByStatusAndReservedStartTimeLessThanEqual(ReservationStatus.PENDING, checkInTime);

        for (ScheduledReservation reservation : reservations) {
            Spot spot = reservation.getSpot();
            if (spot.getIsAvailable()) {
                findSpotAndChangeAvailability(spot.getId(), false);
                reservation.setStatus(ReservationStatus.ACTIVE);
                reservationRepository.save(reservation);
            } else {
                throw new BadRequestException("Spot " + spot.getId() + " is already occupied and cannot be used for scheduled reservation " + reservation.getId());
            }
        }

        return reservations.stream().map(ReservationResponse::fromScheduledReservation).toList();
    }

}
