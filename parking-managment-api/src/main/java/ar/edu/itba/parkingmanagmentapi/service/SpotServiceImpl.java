package ar.edu.itba.parkingmanagmentapi.service;

import ar.edu.itba.parkingmanagmentapi.dto.SpotRequest;
import ar.edu.itba.parkingmanagmentapi.dto.SpotResponse;
import ar.edu.itba.parkingmanagmentapi.exceptions.BadRequestException;
import ar.edu.itba.parkingmanagmentapi.exceptions.NotFoundException;
import ar.edu.itba.parkingmanagmentapi.model.Manager;
import ar.edu.itba.parkingmanagmentapi.model.ParkingLot;
import ar.edu.itba.parkingmanagmentapi.model.Spot;
import ar.edu.itba.parkingmanagmentapi.model.User;
import ar.edu.itba.parkingmanagmentapi.repository.SpotRepository;
import ar.edu.itba.parkingmanagmentapi.repository.SpotSpecifications;
import ar.edu.itba.parkingmanagmentapi.util.ParkingLotMapper;
import ar.edu.itba.parkingmanagmentapi.validators.SpotRequestValidator;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class SpotServiceImpl implements SpotService {

    private final SpotRepository spotRepository;
    private final ParkingLotService parkingLotService;
    private final SpotRequestValidator spotRequestValidator;

    public SpotServiceImpl(SpotRepository spotRepository, ParkingLotService parkingLotService, SpotRequestValidator spotRequestValidator) {
        this.spotRepository = spotRepository;
        this.parkingLotService = parkingLotService;
        this.spotRequestValidator = spotRequestValidator;
    }

    @Override
    public SpotResponse createSpot(Long parkingLotId, SpotRequest request) {
        spotRequestValidator.validate(request);

        ParkingLot parkingLot = parkingLotService.findEntityById(parkingLotId);

        if (spotRepository.existsByParkingLotAndFloorAndCode(parkingLot, request.getFloor(), request.getCode())) {
            throw new BadRequestException("Spot with code " + request.getCode() + " and floor " + request.getFloor() + " already exists in this parking lot");
        }

        Spot spot = new Spot();
        spot.setVehicleType(request.getVehicleType().toLowerCase());
        spot.setFloor(request.getFloor());
        spot.setCode(request.getCode());
        spot.setIsAvailable(true);
        spot.setParkingLot(parkingLot);

        return ParkingLotMapper.toSpotResponse(spotRepository.save(spot));
    }

    @Override
    public SpotResponse findById(Long parkingLotId, Long id) {
        return spotRepository.findById(id)
                .filter(spot -> spot.getParkingLot().getId().equals(parkingLotId))
                .map(ParkingLotMapper::toSpotResponse)
                .orElseThrow(() -> new NotFoundException("Spot not found in this parking lot with id: " + id));
    }

    @Override
    @Transactional
    public SpotResponse updateSpot(Long parkingLotId, Long id, SpotRequest request) {
        spotRequestValidator.validate(request);
        ParkingLot parkingLot = parkingLotService.findEntityById(parkingLotId);

        if (spotRepository.existsByParkingLotAndFloorAndCode(parkingLot, request.getFloor(), request.getCode())) {
            throw new BadRequestException("Spot with code " + request.getCode() + " and floor " + request.getFloor() + " already exists in this parking lot");
        }

        Spot spot = spotRepository.findById(id)
                .filter(s -> s.getParkingLot().getId().equals(parkingLotId))
                .orElseThrow(() -> new NotFoundException("Spot not found in this parking lot with id: " + id));

        spot.setVehicleType(request.getVehicleType());
        spot.setCode(request.getCode());
        spot.setFloor(request.getFloor());
        spot.setIsAvailable(request.getIsAvailable());

        return ParkingLotMapper.toSpotResponse(spotRepository.save(spot));
    }

    @Override
    public void deleteSpot(Long parkingLotId, Long id) {
        Spot spot = spotRepository.findById(id)
                .filter(s -> s.getParkingLot().getId().equals(parkingLotId))
                .orElseThrow(() -> new NotFoundException("Spot not found in this parking lot with id: " + id));
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
    public Page<SpotResponse> findByFilters(Long parkingLotId, Boolean available, String vehicleType, Integer floor, Pageable pageable) {
        return spotRepository.findAll(SpotSpecifications.withFilters(parkingLotId, available, vehicleType, floor), pageable)
                .map(ParkingLotMapper::toSpotResponse);
    }

}
