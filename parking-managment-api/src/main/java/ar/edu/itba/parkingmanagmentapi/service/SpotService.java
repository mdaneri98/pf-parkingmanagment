package ar.edu.itba.parkingmanagmentapi.service;

import ar.edu.itba.parkingmanagmentapi.dto.SpotRequest;
import ar.edu.itba.parkingmanagmentapi.dto.SpotResponse;
import ar.edu.itba.parkingmanagmentapi.model.Spot;
import ar.edu.itba.parkingmanagmentapi.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

public interface SpotService {
    SpotResponse createSpot(Long parkingLotId, SpotRequest request);

    SpotResponse findById(Long parkingLotId, Long id);

    SpotResponse updateSpot(Long parkingLotId, Long id, SpotRequest request);

    void deleteSpot(Long parkingLotId, Long id);

    Optional<User> getManagerOfSpot(Long spotId);

    Page<SpotResponse> findByFilters(Long parkingLotId, Boolean available, String vehicleType, Integer floor, Boolean isAccessible, Boolean isReservable, Pageable pageable);

    // -------------------------- RAW ENTITIES --------------------------

    Spot findEntityById(Long spotId);

    Spot updateEntity(Spot spot);

}
