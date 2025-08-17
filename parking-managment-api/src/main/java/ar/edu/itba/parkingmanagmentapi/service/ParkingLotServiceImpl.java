package ar.edu.itba.parkingmanagmentapi.service;

import ar.edu.itba.parkingmanagmentapi.dto.ParkingLotRequest;
import ar.edu.itba.parkingmanagmentapi.dto.ParkingLotResponse;
import ar.edu.itba.parkingmanagmentapi.dto.SpotResponse;
import ar.edu.itba.parkingmanagmentapi.dto.UpdateParkingLotRequest;
import ar.edu.itba.parkingmanagmentapi.exceptions.NotFoundException;
import ar.edu.itba.parkingmanagmentapi.model.ParkingLot;
import ar.edu.itba.parkingmanagmentapi.model.Spot;
import ar.edu.itba.parkingmanagmentapi.repository.ParkingLotRepository;
import ar.edu.itba.parkingmanagmentapi.repository.SpotRepository;
import ar.edu.itba.parkingmanagmentapi.repository.SpotSpecifications;
import ar.edu.itba.parkingmanagmentapi.util.ParkingLotMapper;
import ar.edu.itba.parkingmanagmentapi.validators.CreateParkingLotRequestValidator;
import ar.edu.itba.parkingmanagmentapi.validators.UpdateParkingLotRequestValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ParkingLotServiceImpl implements ParkingLotService {

    private final ParkingLotRepository parkingLotRepository;

    private final SpotRepository spotRepository;

    private final CreateParkingLotRequestValidator createParkingLotRequestValidator;

    private final UpdateParkingLotRequestValidator updateParkingLotRequestValidator;

    @Override
    public ParkingLotResponse createParkingLot(ParkingLotRequest request) {
        createParkingLotRequestValidator.validate(request);
        if (parkingLotRepository.existsByAddress(request.getAddress())) {
            throw new IllegalArgumentException("ParkingLot with address " + request.getAddress() + " already exists");
        }

        ParkingLot parkingLot = new ParkingLot();
        parkingLot.setName(request.getName());
        parkingLot.setAddress(request.getAddress());
        parkingLot.setImageUrl(request.getImageUrl());
        parkingLot.setLatitude(request.getLatitude());
        parkingLot.setLongitude(request.getLongitude());
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
        if (!parkingLotRepository.existsById(id)) {
            throw new NotFoundException("ParkingLot with id " + id + " not found");
        }
        parkingLotRepository.deleteById(id);
    }

    @Override
    public ParkingLot findEntityById(Long id) {
        return parkingLotRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("ParkingLot not found"));
    }

    @Override
    public Page<SpotResponse> findByFilters(Long parkingLotId, Boolean available, String vehicleType, Integer floor, Pageable pageable) {
        return spotRepository.findAll(
                SpotSpecifications.withFilters(parkingLotId, available, vehicleType, floor),
                pageable
        ).map(ParkingLotMapper::toSpotResponse);
    }
}
