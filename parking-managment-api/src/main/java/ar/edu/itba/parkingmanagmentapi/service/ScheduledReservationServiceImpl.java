package ar.edu.itba.parkingmanagmentapi.service;

import ar.edu.itba.parkingmanagmentapi.dto.ScheduledReservationRequest;
import ar.edu.itba.parkingmanagmentapi.dto.ScheduledReservationResponse;
import ar.edu.itba.parkingmanagmentapi.dto.enums.ReservationStatus;
import ar.edu.itba.parkingmanagmentapi.exceptions.BadRequestException;
import ar.edu.itba.parkingmanagmentapi.exceptions.NotFoundException;
import ar.edu.itba.parkingmanagmentapi.model.ParkingPrice;
import ar.edu.itba.parkingmanagmentapi.model.ScheduledReservation;
import ar.edu.itba.parkingmanagmentapi.model.Spot;
import ar.edu.itba.parkingmanagmentapi.model.UserVehicleAssignment;
import ar.edu.itba.parkingmanagmentapi.repository.*;
import ar.edu.itba.parkingmanagmentapi.validators.CreateReservationRequestValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ScheduledReservationServiceImpl implements ScheduledReservationService {

    private final ScheduledReservationRepository reservationRepository;
    private final SpotRepository spotRepository;
    private final ParkingPriceRepository parkingPriceRepository;
    private final UserVehicleAssignmentRepository userVehicleAssignmentRepository;
    private final CreateReservationRequestValidator createReservationRequestValidator;

    @Override
    public ScheduledReservationResponse createReservation(ScheduledReservationRequest request) {
        createReservationRequestValidator.validate(request);
        Spot spot = spotRepository.findById(request.getSpotId())
                .orElseThrow(() -> new NotFoundException("Spot with id " + request.getSpotId() + " not found"));

        // buscar relación User-Vehicle
        UserVehicleAssignment uva = userVehicleAssignmentRepository
                .findByUserIdAndVehicleLicensePlate(request.getUserId(), request.getVehicleLicensePlate())
                .orElseThrow(() -> new NotFoundException(
                        "There is no vehicle assignment with license plate " + request.getVehicleLicensePlate() +
                                " for the user with id " + request.getUserId()
                ));

        List<ScheduledReservation> overlapping = reservationRepository
                .findBySpotAndReservedStartTimeLessThanEqualAndExpectedEndTimeGreaterThanEqual(
                        spot,
                        request.getReservedStartTime(),
                        request.getExpectedEndTime()
                );
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
        reservation.setUserVehicleAssignment(uva);

        reservationRepository.save(reservation);

        return ScheduledReservationResponse.fromEntity(reservation);
    }

    private BigDecimal calculateEstimatedPrice(Spot spot, LocalDateTime start, LocalDateTime end) {
        List<ParkingPrice> prices = parkingPriceRepository.findByParkingLotIdAndVehicleType(
                spot.getParkingLot().getId(),
                spot.getVehicleType()
        );

        if (prices.isEmpty()) {
            throw new NotFoundException("There are no rates available for this type of vehicle.");
        }

        ParkingPrice price = prices.get(0);
        long hours = java.time.Duration.between(start, end).toHours();
        if (hours == 0) hours = 1;

        return price.getPrice().multiply(BigDecimal.valueOf(hours));
    }

    @Override
    public ScheduledReservationResponse getReservation(Long id) {
        ScheduledReservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Reservation with id " + id + " not found"));
        return ScheduledReservationResponse.fromEntity(reservation);
    }

    @Override
    public ScheduledReservationResponse cancelReservation(Long id) {
        ScheduledReservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Reservation with id " + id + " not found"));

        reservation.setStatus(ReservationStatus.CANCELLED);
        reservationRepository.save(reservation);

        return ScheduledReservationResponse.fromEntity(reservation);
    }

    @Override
    public Page<ScheduledReservationResponse> getReservationsByUser(Long userId, ReservationStatus status, String vehiclePlate, LocalDateTime from, LocalDateTime to, Pageable pageable) {
        return reservationRepository.findAll(ScheduledReservationSpecifications.withFilters(userId, null, status, vehiclePlate, from, to), pageable)
                .map(ScheduledReservationResponse::fromEntity);
    }

    @Override
    public Page<ScheduledReservationResponse> getScheduledReservationsByParkingLot(Long parkingLotId, ReservationStatus status, LocalDateTime from, LocalDateTime to, Pageable pageable) {
        return reservationRepository.findAll(ScheduledReservationSpecifications.withFilters(null, parkingLotId, status, null, from, to), pageable)
                .map(ScheduledReservationResponse::fromEntity);
    }
}
