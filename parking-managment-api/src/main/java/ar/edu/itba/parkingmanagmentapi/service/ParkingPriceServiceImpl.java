package ar.edu.itba.parkingmanagmentapi.service;

import ar.edu.itba.parkingmanagmentapi.dto.ParkingPriceRequest;
import ar.edu.itba.parkingmanagmentapi.dto.ParkingPriceResponse;
import ar.edu.itba.parkingmanagmentapi.exceptions.BadRequestException;
import ar.edu.itba.parkingmanagmentapi.exceptions.NotFoundException;
import ar.edu.itba.parkingmanagmentapi.model.ParkingLot;
import ar.edu.itba.parkingmanagmentapi.model.ParkingPrice;
import ar.edu.itba.parkingmanagmentapi.repository.ParkingPriceRepository;
import ar.edu.itba.parkingmanagmentapi.repository.ParkingPriceSpecifications;
import ar.edu.itba.parkingmanagmentapi.validators.ParkingPriceRequestValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ParkingPriceServiceImpl implements ParkingPriceService {

    private final ParkingPriceRepository parkingPriceRepository;
    private final ParkingLotService parkingLotService;

    private final ParkingPriceRequestValidator parkingPriceRequestValidator;

    @Override
    public ParkingPriceResponse create(Long parkingLotId, ParkingPriceRequest request) {
        parkingPriceRequestValidator.validate(request);
        ParkingLot parkingLot = parkingLotService.findEntityById(parkingLotId);

        validateNoOverlap(parkingLot, parkingLotId, null, request);

        ParkingPrice parkingPrice = new ParkingPrice();
        parkingPrice.setVehicleType(request.getVehicleType());
        parkingPrice.setPrice(request.getPrice());
        parkingPrice.setValidFrom(request.getValidFrom());
        parkingPrice.setValidTo(request.getValidTo());
        parkingPrice.setParkingLot(parkingLot);

        ParkingPrice saved = parkingPriceRepository.save(parkingPrice);
        return toResponse(saved);
    }

    @Override
    @Transactional
    public ParkingPriceResponse update(Long parkingLotId, Long id, ParkingPriceRequest request) {
        parkingPriceRequestValidator.validate(request);
        ParkingLot parkingLot = parkingLotService.findEntityById(parkingLotId);

        ParkingPrice parkingPrice = parkingPriceRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("ParkingPrice not found"));

        validateNoOverlap(parkingLot, parkingLotId, id, request);

        parkingPrice.setVehicleType(request.getVehicleType());
        parkingPrice.setPrice(request.getPrice());
        parkingPrice.setValidFrom(request.getValidFrom());
        parkingPrice.setValidTo(request.getValidTo());

        ParkingPrice updated = parkingPriceRepository.save(parkingPrice);
        return toResponse(updated);
    }


    private void validateNoOverlap(ParkingLot parkingLot, Long parkingLotId, Long excludeId, ParkingPriceRequest request) {
        List<ParkingPrice> existingPrices =
                parkingPriceRepository.findByParkingLotAndVehicleType(parkingLot, request.getVehicleType());

        boolean overlaps = existingPrices.stream()
                .filter(p -> !p.getId().equals(excludeId))
                .anyMatch(existing -> {
                    LocalDateTime newFrom = request.getValidFrom();
                    LocalDateTime newTo = request.getValidTo();

                    LocalDateTime existingFrom = existing.getValidFrom();
                    LocalDateTime existingTo = existing.getValidTo();

                    return (newTo == null || existingFrom.isBefore(newTo)) &&
                            (existingTo == null || newFrom.isBefore(existingTo));
                });

        if (overlaps) {
            throw new BadRequestException("There is already an overlapping price for this type of vehicle.");
        }
    }

    @Override
    public ParkingPriceResponse getById(Long parkingLotId, Long id) {
        ParkingPrice parkingPrice = parkingPriceRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("ParkingPrice not found"));
        return toResponse(parkingPrice);
    }

    @Override
    public List<ParkingPriceResponse> getByParkingLot(Long parkingLotId) {
        return parkingPriceRepository.findByParkingLotId(parkingLotId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public void delete(Long parkingLotId, Long id) {
        ParkingLot parkingLot = parkingLotService.findEntityById(parkingLotId);

        ParkingPrice price = parkingPriceRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("ParkingPrice not found with id " + id));

        parkingPriceRepository.delete(price);
    }

    @Override
    public List<ParkingPriceResponse> getByFilters(Long parkingLotId, BigDecimal min, BigDecimal max,
                                                   String vehicleType, LocalDateTime from, LocalDateTime to, String sort) {
        Specification<ParkingPrice> spec = ParkingPriceSpecifications.withFilters(parkingLotId, min, max, vehicleType, from, to);

        Sort sortSpec = "desc".equalsIgnoreCase(sort)
                ? Sort.by(Sort.Direction.DESC, "price")
                : Sort.by(Sort.Direction.ASC, "price");

        return parkingPriceRepository.findAll(spec, sortSpec)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private ParkingPriceResponse toResponse(ParkingPrice entity) {
        return new ParkingPriceResponse(entity.getId(), entity.getVehicleType(), entity.getPrice(), entity.getValidFrom(), entity.getValidTo());
    }
}
