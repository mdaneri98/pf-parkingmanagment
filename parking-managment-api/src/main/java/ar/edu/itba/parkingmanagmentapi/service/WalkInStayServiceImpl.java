package ar.edu.itba.parkingmanagmentapi.service;

import ar.edu.itba.parkingmanagmentapi.config.AppConstants;
import ar.edu.itba.parkingmanagmentapi.dto.ReservationResponse;
import ar.edu.itba.parkingmanagmentapi.dto.WalkInStayRequest;
import ar.edu.itba.parkingmanagmentapi.dto.enums.ReservationStatus;
import ar.edu.itba.parkingmanagmentapi.exceptions.NotFoundException;
import ar.edu.itba.parkingmanagmentapi.model.Spot;
import ar.edu.itba.parkingmanagmentapi.model.UserVehicleAssignment;
import ar.edu.itba.parkingmanagmentapi.model.Vehicle;
import ar.edu.itba.parkingmanagmentapi.model.WalkInStay;
import ar.edu.itba.parkingmanagmentapi.repository.ParkingPriceRepository;
import ar.edu.itba.parkingmanagmentapi.repository.ScheduledReservationRepository;
import ar.edu.itba.parkingmanagmentapi.repository.WalkInStayRepository;
import ar.edu.itba.parkingmanagmentapi.repository.WalkInStaySpecifications;
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
            VehicleService vehicleService,
            WalkInStayRepository walkInStayRepository,
            WalkInStayRequestValidator walkInStayRequestValidator,
            UserVehicleAssignmentService userVehicleAssignmentService) {
        super(spotService, parkingPriceRepository, vehicleService, walkInStayRepository, reservationRepository, userVehicleAssignmentService);
        this.walkInStayRequestValidator = walkInStayRequestValidator;
    }

    @Override
    public ReservationResponse createReservation(WalkInStayRequest request) {
        walkInStayRequestValidator.validate(request);

        Spot spot = spotService.findEntityById(request.getSpotId());

        if (!existActivePrice(spot.getParkingLot().getId(), spot.getVehicleType())) {
            throw new NotFoundException("There are no active prices for this type of vehicle in the parking lot");
        }

        Vehicle vehicle = vehicleService.findEntityByLicensePlateOrCreate(new Vehicle(request.getVehicleLicensePlate(), null, null, spot.getVehicleType()));
        UserVehicleAssignment assignment = userVehicleAssignmentService.findByUserIdAndLicensePlateOrCreate(AppConstants.DEFAULT_USER_ID, vehicle.getLicensePlate());

        WalkInStay stay = new WalkInStay();
        stay.setCheckInTime(LocalDateTime.now());
        stay.setStatus(ReservationStatus.ACTIVE);
        stay.setExpectedEndTime(stay.getCheckInTime().plusHours(request.getExpectedDurationHours()));
        stay.setSpot(spot);
        stay.setCheckOutTime(LocalDateTime.now().plusDays(1)); // Default value, will be updated on check-out
        stay.setUserVehicleAssignment(assignment);

        //esto no me gusto tanto como quedo, pero habria que ver como refactorizar el updateEntityById
        spot.setIsAvailable(false);
        spotService.updateEntityById(spot.getId(), spot);

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
            findSpotAndChangeAvailability(stay.getSpot().getId(), true);
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
}
