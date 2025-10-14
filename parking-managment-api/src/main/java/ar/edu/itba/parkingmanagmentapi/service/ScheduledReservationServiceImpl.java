package ar.edu.itba.parkingmanagmentapi.service;

import ar.edu.itba.parkingmanagmentapi.dto.ReservationResponse;
import ar.edu.itba.parkingmanagmentapi.dto.ScheduledReservationRequest;
import ar.edu.itba.parkingmanagmentapi.dto.enums.ReservationStatus;
import ar.edu.itba.parkingmanagmentapi.exceptions.BadRequestException;
import ar.edu.itba.parkingmanagmentapi.exceptions.NotFoundException;
import ar.edu.itba.parkingmanagmentapi.model.*;
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
            SpotService spotService,
            ParkingPriceRepository parkingPriceRepository,
            ScheduledReservationRepository reservationRepository,
            UserRepository userRepository,
            VehicleService vehicleService,
            WalkInStayRepository walkInStayRepository,
            ScheduledReservationRequestValidator scheduledReservationRequestValidator,
            UserVehicleAssignmentService userVehicleAssignmentService) {
        super(spotService, parkingPriceRepository, userRepository, vehicleService, walkInStayRepository, reservationRepository, userVehicleAssignmentService);
        this.scheduledReservationRequestValidator = scheduledReservationRequestValidator;
    }

    @Override
    public ReservationResponse createReservation(ScheduledReservationRequest request) {
        scheduledReservationRequestValidator.validate(request);

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new NotFoundException("User not found"));

        Vehicle vehicle = vehicleService.findEntityByLicensePlate(request.getVehicleLicensePlate());

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

        UserVehicleAssignment assignment = userVehicleAssignmentService.findByUserIdAndLicensePlate(user.getId(), vehicle.getLicensePlate());

        ScheduledReservation reservation = new ScheduledReservation();
        reservation.setReservedStartTime(request.getReservedStartTime());
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
    public Page<ReservationResponse> getReservationsByParkingLot(Long parkingLotId, ReservationStatus status, LocalDateTime from, LocalDateTime to, Pageable pageable) {
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
                spot.setIsAvailable(false); //Esta bien esto? Y si ya estaba ocupado?
                reservation.setStatus(ReservationStatus.ACTIVE);
                spotService.updateEntityById(spot.getId(), spot);
                reservationRepository.save(reservation);
            }
        }

        return reservations.stream().map(ReservationResponse::fromScheduledReservation).toList();
    }

}
