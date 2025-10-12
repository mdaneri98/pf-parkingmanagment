package ar.edu.itba.parkingmanagmentapi.service;

import ar.edu.itba.parkingmanagmentapi.config.AppConstants;
import ar.edu.itba.parkingmanagmentapi.dto.ReservationResponse;
import ar.edu.itba.parkingmanagmentapi.dto.ScheduledReservationRequest;
import ar.edu.itba.parkingmanagmentapi.dto.enums.ReservationStatus;
import ar.edu.itba.parkingmanagmentapi.exceptions.BadRequestException;
import ar.edu.itba.parkingmanagmentapi.exceptions.NotFoundException;
import ar.edu.itba.parkingmanagmentapi.model.*;
import ar.edu.itba.parkingmanagmentapi.repository.*;
import ar.edu.itba.parkingmanagmentapi.validators.ScheduledReservationRequestValidator;
import ar.edu.itba.parkingmanagmentapi.validators.WalkInStayRequestValidator;
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
            ScheduledReservationRepository reservationRepository,
            UserRepository userRepository,
            VehicleRepository vehicleRepository,
            WalkInStayRepository walkInStayRepository,
            ScheduledReservationRequestValidator scheduledReservationRequestValidator,
            UserVehicleAssignmentRepository userVehicleAssignmentRepository) {
        super(spotRepository, parkingPriceRepository, userRepository, vehicleRepository, walkInStayRepository, reservationRepository, userVehicleAssignmentRepository);
        this.scheduledReservationRequestValidator = scheduledReservationRequestValidator;
    }

    @Override
    public ReservationResponse createReservation(ScheduledReservationRequest request) {
        scheduledReservationRequestValidator.validate(request);

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new NotFoundException("User not found"));

        Vehicle vehicle = vehicleRepository.findById(request.getVehicleLicensePlate())
                .orElseThrow(() -> new NotFoundException("Vehicle not found"));

        Spot spot = spotRepository.findById(request.getSpotId())
                .orElseThrow(() -> new NotFoundException("Spot not found"));

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

        UserVehicleAssignmentId assignmentId = new UserVehicleAssignmentId(user.getId(), vehicle.getLicensePlate());
        UserVehicleAssignment assignment = userVehicleAssignmentRepository.findById(assignmentId)
                .orElseGet(() -> {
                    UserVehicleAssignment newAssignment = new UserVehicleAssignment(user, vehicle);
                    return userVehicleAssignmentRepository.save(newAssignment);
                });

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
    public Page<ReservationResponse> getScheduledReservationsByParkingLot(Long parkingLotId, ReservationStatus status, LocalDateTime from, LocalDateTime to, Pageable pageable) {
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
                spot.setIsAvailable(false);
                reservation.setStatus(ReservationStatus.ACTIVE);
                spotRepository.save(spot);
                reservationRepository.save(reservation);
            }
        }

        return reservations.stream().map(ReservationResponse::fromScheduledReservation).toList();
    }

}
