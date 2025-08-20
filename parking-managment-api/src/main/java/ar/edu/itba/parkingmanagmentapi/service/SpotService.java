package ar.edu.itba.parkingmanagmentapi.service;

import ar.edu.itba.parkingmanagmentapi.dto.SpotRequest;
import ar.edu.itba.parkingmanagmentapi.dto.SpotResponse;
import ar.edu.itba.parkingmanagmentapi.model.User;

import java.util.Optional;

public interface SpotService {
    SpotResponse createSpot(SpotRequest request);

    SpotResponse findById(Long id);

    SpotResponse updateSpot(Long id, SpotRequest request);

    void deleteSpot(Long id);

    Optional<User> getManagerOfSpot(Long spotId);

}
