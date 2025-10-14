package ar.edu.itba.parkingmanagmentapi.service;

import ar.edu.itba.parkingmanagmentapi.config.AppConstants;
import ar.edu.itba.parkingmanagmentapi.dto.ReservationResponse;
import ar.edu.itba.parkingmanagmentapi.dto.WalkInStayRequest;
import ar.edu.itba.parkingmanagmentapi.dto.enums.ReservationStatus;
import ar.edu.itba.parkingmanagmentapi.exceptions.NotFoundException;
import ar.edu.itba.parkingmanagmentapi.model.*;
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
import java.util.stream.Collectors;

@Service
public class WalkInStayServiceImpl extends ReservationServiceImpl<WalkInStayRequest> implements WalkInStayService {

    private final WalkInStayRequestValidator walkInStayRequestValidator;

    protected WalkInStayServiceImpl(
            SpotService spotService,
            ParkingPriceRepository parkingPriceRepository,
            ScheduledReservationRepository reservationRepository,
            UserRepository userRepository,
            VehicleService vehicleService,
            WalkInStayRepository walkInStayRepository,
            WalkInStayRequestValidator walkInStayRequestValidator,
            UserVehicleAssignmentService userVehicleAssignmentService) {
        super(spotService, parkingPriceRepository, userRepository, vehicleService, walkInStayRepository, reservationRepository, userVehicleAssignmentService);
        this.walkInStayRequestValidator = walkInStayRequestValidator;
    }

    @Override
    public ReservationResponse createReservation(WalkInStayRequest request) {
        walkInStayRequestValidator.validate(request);

        User defaultUser = userRepository.findById(AppConstants.DEFAULT_USER_ID)
                .orElseThrow(() -> new NotFoundException("There is no default user"));

        Vehicle vehicle = vehicleService.findEntityByLicensePlateOrCreate(new Vehicle(request.getVehicleLicensePlate(), null, null, null));
        UserVehicleAssignment assignment = userVehicleAssignmentService.findByUserIdAndLicensePlateOrCreate(defaultUser.getId(), vehicle.getLicensePlate());

        Spot spot = findSpotAndChangeAvailability(request.getSpotId(), false);

        WalkInStay stay = new WalkInStay();
        stay.setCheckInTime(LocalDateTime.now());
        stay.setStatus(ReservationStatus.ACTIVE);
        stay.setExpectedEndTime(stay.getCheckInTime().plusHours(request.getExpectedDurationHours()));
        stay.setSpot(spot);
        stay.setCheckOutTime(LocalDateTime.now().plusDays(1)); // Default value, will be updated on check-out
        stay.setUserVehicleAssignment(assignment);

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

        findSpotAndChangeAvailability(stay.getSpot().getId(), true);
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
    public Page<ReservationResponse> getReservationsByParkingLot(Long parkingLotId, ReservationStatus status, LocalDateTime from, LocalDateTime to, Pageable pageable) {
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

    //esto se deberia borrar porque ya estaba getReservationsByParkingLot
    @Override
    public List<ReservationResponse> getWalkInStaysByParkingLot(Long parkingLotId) {
        //TODO: Not performant. Needs improve.
        return walkInStayRepository.findAll().stream()
                .filter(wis -> wis.getSpot().getParkingLot().getId().equals(parkingLotId))
                .map(ReservationResponse::fromWalkInStay)
                .collect(Collectors.toList());
    }

    private Spot findSpotAndChangeAvailability(Long spotId, boolean makeAvailable) {
        Spot spot = spotService.findEntityById(spotId);

        if (!makeAvailable && !spot.getIsAvailable()) {
            throw new NotFoundException("The spot with id " + spot.getId() + " is not available");
        }

        spot.setIsAvailable(makeAvailable);
        return spotService.updateEntityById(spotId, spot);
    }

}
