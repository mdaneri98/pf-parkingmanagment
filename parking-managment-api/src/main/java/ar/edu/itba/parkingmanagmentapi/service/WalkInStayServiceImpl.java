package ar.edu.itba.parkingmanagmentapi.service;

import ar.edu.itba.parkingmanagmentapi.dto.ReservationResponse;
import ar.edu.itba.parkingmanagmentapi.dto.WalkInStayRequest;
import ar.edu.itba.parkingmanagmentapi.dto.enums.ReservationStatus;
import ar.edu.itba.parkingmanagmentapi.exceptions.NotFoundException;
import ar.edu.itba.parkingmanagmentapi.model.Spot;
import ar.edu.itba.parkingmanagmentapi.model.WalkInStay;
import ar.edu.itba.parkingmanagmentapi.repository.*;
import ar.edu.itba.parkingmanagmentapi.validators.WalkInStayRequestValidator;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class WalkInStayServiceImpl extends ReservationServiceImpl<WalkInStayRequest> implements WalkInStayService {

    private final WalkInStayRequestValidator walkInStayRequestValidator;

    protected WalkInStayServiceImpl(
            SpotRepository spotRepository,
            ParkingPriceRepository parkingPriceRepository,
            ScheduledReservationRepository reservationRepository,
            UserVehicleAssignmentRepository userVehicleAssignmentRepository,
            WalkInStayRepository walkInStayRepository,
            WalkInStayRequestValidator walkInStayRequestValidator) {
        super(spotRepository, parkingPriceRepository, userVehicleAssignmentRepository, walkInStayRepository, reservationRepository);
        this.walkInStayRequestValidator = walkInStayRequestValidator;
    }

    @Override
    public ReservationResponse createReservation(WalkInStayRequest request) {
        walkInStayRequestValidator.validate(request);
        Spot spot = getSpotById(request.getSpotId());

        if (!spot.getIsAvailable()) {
            throw new NotFoundException("The spot with id " + spot.getId() + " is not available for walk-in stays");
        }

        spot.setIsAvailable(false);
        spotRepository.save(spot);

        WalkInStay stay = new WalkInStay();
        stay.setCheckInTime(LocalDateTime.now());
        stay.setStatus(ReservationStatus.ACTIVE);
        stay.setExpectedEndTime(stay.getCheckInTime().plusHours(request.getExpectedDurationHours()));
        stay.setSpot(spot);
        stay.setCheckOutTime(LocalDateTime.now().plusDays(1)); // Default value, will be updated on check-out
        stay.setUserVehicleAssignment(getUserVehicleAssignmentByVehicleLicensePlate(request.getVehicleLicensePlate()));

        walkInStayRepository.save(stay);
        return ReservationResponse.fromWalkInStay(stay);
    }

    @Override
    public ReservationResponse getReservation(Long id) {
        WalkInStay stay = walkInStayRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Walk-in stay with id " + id + " not found"));
        return ReservationResponse.fromWalkInStay(stay);
    }

    @Override
    public ReservationResponse updateReservationStatus(Long id, ReservationStatus status) {
        WalkInStay stay = walkInStayRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Walk-in stay with id " + id + " not found"));

        stay.setStatus(status);

        if (status == ReservationStatus.COMPLETED) {
            stay.setCheckOutTime(LocalDateTime.now());
            BigDecimal totalPrice = calculateEstimatedPrice(
                    stay.getSpot(),
                    stay.getCheckInTime(),
                    stay.getCheckOutTime()
            );
            stay.setTotalPrice(totalPrice);
        }

        walkInStayRepository.save(stay);
        return ReservationResponse.fromWalkInStay(stay);
    }

    @Override
    public Page<ReservationResponse> getReservationsByUser(Long userId, ReservationStatus status, String vehiclePlate, LocalDateTime from, LocalDateTime to, Pageable pageable) {
        return walkInStayRepository.findAll(
                        WalkInStaySpecifications.withFilters(userId, null, status, vehiclePlate, from, to),
                        pageable
                )
                .map(ReservationResponse::fromWalkInStay);
    }

    @Override
    public Page<ReservationResponse> getScheduledReservationsByParkingLot(Long parkingLotId, ReservationStatus status, LocalDateTime from, LocalDateTime to, Pageable pageable) {
        return walkInStayRepository.findAll(
                        WalkInStaySpecifications.withFilters(null, parkingLotId, status, null, from, to),
                        pageable
                )
                .map(ReservationResponse::fromWalkInStay);
    }

    @Override
    @Transactional
    public ReservationResponse extendReservation(Long id, int extraHours) {
        WalkInStay stay = walkInStayRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Walk-in stay not found"));

        stay.setExpectedEndTime(stay.getExpectedEndTime().plusHours(extraHours));
        walkInStayRepository.save(stay);
        return ReservationResponse.fromWalkInStay(stay);
    }

    @Override
    public Duration getRemainingTime(Long id) {
        WalkInStay stay = walkInStayRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Walk-in stay not found"));

        return Duration.between(LocalDateTime.now(), stay.getExpectedEndTime());
    }

    @Override
    public List<ReservationResponse> getExpiringReservations() {
        List<WalkInStay> stayList = walkInStayRepository.findExpiringSoon(LocalDateTime.now().plusMinutes(30));
        return stayList.stream().map(ReservationResponse::fromWalkInStay).toList();
    }
}
