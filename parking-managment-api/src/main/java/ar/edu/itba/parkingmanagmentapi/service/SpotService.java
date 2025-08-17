package ar.edu.itba.parkingmanagmentapi.service;

import ar.edu.itba.parkingmanagmentapi.dto.SpotRequest;
import ar.edu.itba.parkingmanagmentapi.dto.SpotResponse;

public interface SpotService {
    SpotResponse createSpot(SpotRequest request);

    SpotResponse findById(Long id);

    SpotResponse updateSpot(Long id, SpotRequest request);

    void deleteSpot(Long id);

}
