package ar.edu.itba.parkingmanagmentapi.service;

import ar.edu.itba.parkingmanagmentapi.dto.ParkingPriceRequest;
import ar.edu.itba.parkingmanagmentapi.dto.ParkingPriceResponse;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface ParkingPriceService {

    ParkingPriceResponse create(Long parkingLotId, ParkingPriceRequest request);

    ParkingPriceResponse update(Long parkingLotId, Long id, ParkingPriceRequest request);

    ParkingPriceResponse getById(Long parkingLotId, Long id);

    List<ParkingPriceResponse> getByParkingLot(Long parkingLotId);

    void delete(Long parkingLotId, Long id);

    List<ParkingPriceResponse> getByFilters(Long parkingLotId, BigDecimal min, BigDecimal max,
                                            String vehicleType, LocalDateTime from, LocalDateTime to, String sort);
}
