package ar.edu.itba.parkingmanagmentapi.service;

import ar.edu.itba.parkingmanagmentapi.dto.SpotRequest;
import ar.edu.itba.parkingmanagmentapi.dto.SpotResponse;
import ar.edu.itba.parkingmanagmentapi.exceptions.BadRequestException;
import ar.edu.itba.parkingmanagmentapi.exceptions.NotFoundException;
import ar.edu.itba.parkingmanagmentapi.model.Manager;
import ar.edu.itba.parkingmanagmentapi.model.ParkingLot;
import ar.edu.itba.parkingmanagmentapi.model.Spot;
import ar.edu.itba.parkingmanagmentapi.model.User;
import ar.edu.itba.parkingmanagmentapi.repository.ScheduledReservationRepository;
import ar.edu.itba.parkingmanagmentapi.repository.SpotRepository;
import ar.edu.itba.parkingmanagmentapi.repository.SpotSpecifications;
import ar.edu.itba.parkingmanagmentapi.repository.WalkInStayRepository;
import ar.edu.itba.parkingmanagmentapi.util.ParkingLotMapper;
import ar.edu.itba.parkingmanagmentapi.validators.SpotRequestValidator;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class SpotServiceImpl implements SpotService {

    private final SpotRepository spotRepository;
    private final ParkingLotService parkingLotService;
    private final SpotRequestValidator spotRequestValidator;
    private final ScheduledReservationRepository scheduledReservationRepository;
    private final WalkInStayRepository walkInStayRepository;

    public SpotServiceImpl(SpotRepository spotRepository, ParkingLotService parkingLotService, SpotRequestValidator spotRequestValidator, ScheduledReservationRepository scheduledReservationRepository, WalkInStayRepository walkInStayRepository) {
        this.spotRepository = spotRepository;
        this.parkingLotService = parkingLotService;
        this.spotRequestValidator = spotRequestValidator;
        this.scheduledReservationRepository = scheduledReservationRepository;
        this.walkInStayRepository = walkInStayRepository;
    }

    @Override
    public SpotResponse createSpot(Long parkingLotId, SpotRequest request) {
        spotRequestValidator.validate(request);

        ParkingLot parkingLot = parkingLotService.findEntityById(parkingLotId);

        if (spotRepository.existsByParkingLotAndFloorAndCode(parkingLot, request.getFloor(), request.getCode())) {
            throw new BadRequestException("spot.already.exists", request.getCode(), request.getFloor());
        }

        Spot spot = new Spot();
        spot.setVehicleType(request.getVehicleType().toLowerCase());
        spot.setFloor(request.getFloor());
        spot.setCode(request.getCode());
        spot.setIsAvailable(true);
        spot.setIsReservable(request.getIsReservable());
        spot.setIsAccessible(request.getIsAccessible());
        spot.setParkingLot(parkingLot);
        spot.setIsReservable(request.getIsReservable());

        return ParkingLotMapper.toSpotResponse(spotRepository.save(spot));
    }

    @Override
    public SpotResponse findById(Long parkingLotId, Long id) {
        return spotRepository.findById(id)
                .filter(spot -> spot.getParkingLot().getId().equals(parkingLotId))
                .map(ParkingLotMapper::toSpotResponse)
                .orElseThrow(() -> new NotFoundException("spot.not.found", id));
    }

    @Override
    @Transactional
    public SpotResponse updateSpot(Long parkingLotId, Long id, SpotRequest request) {

        Spot spot = spotRepository.findById(id)
                .filter(s -> s.getParkingLot().getId().equals(parkingLotId))
                .orElseThrow(() -> new NotFoundException("spot.not.found", id));

        if (spotRepository.existsByParkingLotAndFloorAndCodeAndIdNot(parkingLotService.findEntityById(parkingLotId), request.getFloor(), request.getCode(), id)) {
            throw new BadRequestException("spot.already.exists", request.getCode(), request.getFloor());
        }

        spot.setVehicleType(request.getVehicleType());
        spot.setCode(request.getCode());
        spot.setFloor(request.getFloor());
        spot.setIsReservable(request.getIsReservable());
        spot.setIsAccessible(request.getIsAccessible());

        return ParkingLotMapper.toSpotResponse(spotRepository.save(spot));
    }

    @Transactional
    @Override
    public void deleteSpot(Long parkingLotId, Long id) {
        Spot spot = spotRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("spot.not.found", id));

        boolean hasFutureScheduledReservations = scheduledReservationRepository.existsBySpotIdAndReservedStartTimeAfter(spot.getId(), LocalDateTime.now());
        if (hasFutureScheduledReservations || !spot.getIsAvailable()) {
            throw new IllegalStateException("Cannot delete spot: it has future scheduled reservations or is currently occupied");
        }
        // Actualizar los snapshots de las reservas antes de eliminarlo
        scheduledReservationRepository.updateSpotSnapshot(
                spot.getId(), spot.getCode(), spot.getFloor()
        );
        walkInStayRepository.updateSpotSnapshot(
                spot.getId(), spot.getCode(), spot.getFloor()
        );

        spotRepository.delete(spot);
    }

    @Override
    public Optional<User> getManagerOfSpot(Long spotId) {
        return Optional.of(spotRepository.findById(spotId)
                        .map(spot -> {
                            ParkingLot parkingLot = spot.getParkingLot();
                            if (parkingLot == null) return null;
                            Manager manager = parkingLot.getManager();
                            return manager != null ? manager.getUser() : null;
                        }))
                .orElseThrow(() -> new AuthorizationDeniedException("Manager is not authorized to access this spot"));
    }

    @Override
    public Page<SpotResponse> findByFilters(Long parkingLotId, Boolean available, String vehicleType, Integer floor, Boolean isAccessible, Boolean isReservable, Pageable pageable) {
        return spotRepository.findAll(SpotSpecifications.withFilters(parkingLotId, available, vehicleType, floor, isAccessible, isReservable), pageable)
                .map(ParkingLotMapper::toSpotResponse);
    }

    // -------------------------- RAW ENTITIES --------------------------


    @Override
    public Spot findEntityById(Long spotId) {
        return spotRepository.findById(spotId).orElseThrow(() -> new NotFoundException("spot.not.found", spotId));
    }

    @Override
    public Spot updateEntity(Spot spot) {
        return spotRepository.save(spot);
    }
}
