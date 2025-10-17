package ar.edu.itba.parkingmanagmentapi.service;

import ar.edu.itba.parkingmanagmentapi.dto.ParkingLotRequest;
import ar.edu.itba.parkingmanagmentapi.dto.ParkingLotResponse;
import ar.edu.itba.parkingmanagmentapi.dto.UpdateParkingLotRequest;
import ar.edu.itba.parkingmanagmentapi.exceptions.BadRequestException;
import ar.edu.itba.parkingmanagmentapi.exceptions.NotFoundException;
import ar.edu.itba.parkingmanagmentapi.model.Manager;
import ar.edu.itba.parkingmanagmentapi.model.ParkingLot;
import ar.edu.itba.parkingmanagmentapi.model.Spot;
import ar.edu.itba.parkingmanagmentapi.model.User;
import ar.edu.itba.parkingmanagmentapi.repository.ParkingLotRepository;
import ar.edu.itba.parkingmanagmentapi.repository.ScheduledReservationRepository;
import ar.edu.itba.parkingmanagmentapi.security.service.SecurityService;
import ar.edu.itba.parkingmanagmentapi.util.ParkingLotMapper;
import ar.edu.itba.parkingmanagmentapi.validators.CreateParkingLotRequestValidator;
import ar.edu.itba.parkingmanagmentapi.validators.UpdateParkingLotRequestValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ParkingLotServiceImpl implements ParkingLotService {

    private final ParkingLotRepository parkingLotRepository;
    private final CreateParkingLotRequestValidator createParkingLotRequestValidator;
    private final UpdateParkingLotRequestValidator updateParkingLotRequestValidator;
    private final ScheduledReservationRepository scheduledReservationRepository;
    private final SecurityService securityService;

    @Override
    public ParkingLotResponse createParkingLot(ParkingLotRequest request) {
        createParkingLotRequestValidator.validate(request);

        if (parkingLotRepository.existsByAddress(request.getAddress())) {
            throw new IllegalArgumentException(
                    "ParkingLot with address " + request.getAddress() + " already exists"
            );
        }

        Manager currentManager = securityService.getCurrentManager().get();

        ParkingLot parkingLot = new ParkingLot();
        parkingLot.setName(request.getName());
        parkingLot.setAddress(request.getAddress());
        parkingLot.setImageUrl(request.getImageUrl());
        parkingLot.setLatitude(request.getLatitude());
        parkingLot.setLongitude(request.getLongitude());
        parkingLot.setManager(currentManager);
        parkingLot.setSpots(Optional.ofNullable(request.getSpots())
                .orElseGet(List::of)
                .stream()
                .map(spotDto -> {
                    Spot spot = new Spot();
                    spot.setParkingLot(parkingLot);
                    spot.setVehicleType(spotDto.getVehicleType());
                    spot.setFloor(spotDto.getFloor());
                    spot.setCode(spotDto.getCode());
                    return spot;
                })
                .collect(Collectors.toList()));

        return ParkingLotMapper.toParkingLotResponse(parkingLotRepository.save(parkingLot));
    }


    @Override
    public ParkingLotResponse updateParkingLot(Long id, UpdateParkingLotRequest request) {
        updateParkingLotRequestValidator.validate(request);
        ParkingLot parkingLot = parkingLotRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("ParkingLot with id " + id + " not found"));

        parkingLot.setName(request.getName());
        parkingLot.setAddress(request.getAddress());
        parkingLot.setImageUrl(request.getImageUrl());
        parkingLot.setLatitude(request.getLatitude());
        parkingLot.setLongitude(request.getLongitude());

        return ParkingLotMapper.toParkingLotWithoutSpotsResponse(parkingLotRepository.save(parkingLot));
    }

    @Override
    public ParkingLotResponse findById(Long id) {
        return parkingLotRepository.findById(id)
                .map(ParkingLotMapper::toParkingLotWithoutSpotsResponse)
                .orElseThrow(() -> new NotFoundException("ParkingLot not found"));
    }

    @Override
    public List<ParkingLotResponse> findAll() {
        return parkingLotRepository.findAll()
                .stream()
                .map(ParkingLotMapper::toParkingLotWithoutSpotsResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteParkingLot(Long id) {
        ParkingLot parkingLot = parkingLotRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Parking lot not found"));

        boolean hasFutureScheduledReservations = scheduledReservationRepository.existsBySpotParkingLotIdAndReservedStartTimeAfter(
                id, LocalDateTime.now());

        boolean hasUnavailableSpots = parkingLot.getSpots().stream().anyMatch(spot -> !spot.getIsAvailable());

        if (hasUnavailableSpots || hasFutureScheduledReservations) {
            throw new BadRequestException("Cannot delete parking lot: it has active or future reservations");
        }
        parkingLotRepository.deleteById(id);
    }

    @Override
    public ParkingLot findEntityById(Long id) {
        return parkingLotRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("ParkingLot not found"));
    }

    @Override
    public Optional<User> getManagerOfParkingLot(Long parkingLotId) {
        return Optional.ofNullable(parkingLotRepository.findById(parkingLotId)
                .map(ParkingLot::getManager)
                .map(Manager::getUser)
                .orElseThrow(() -> new AuthorizationDeniedException("Manager is not authorized to access this parking lot"))
        );
    }

    @Override
    public List<ParkingLotResponse> findByUserId(Long userId) {
        return parkingLotRepository.findByManagerUserId(userId)
                .stream()
                .map(ParkingLotMapper::toParkingLotWithoutSpotsResponse)
                .collect(Collectors.toList());
    }

}
