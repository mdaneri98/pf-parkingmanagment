package ar.edu.itba.parkingmanagmentapi.service;

import ar.edu.itba.parkingmanagmentapi.dto.ParkingLotRequest;
import ar.edu.itba.parkingmanagmentapi.dto.ParkingLotResponse;

import java.util.List;

public interface ParkingLotService {

    /**
     * Creates a new parking lot
     */
    ParkingLotResponse createParkingLot(ParkingLotRequest parkingLotRequest);

    /**
     * Updates an existing parking lot
     */
    ParkingLotResponse updateParkingLot(Long id, ParkingLotRequest parkingLotRequest);

    /**
     * Finds a parking lot by ID
     */
    ParkingLotResponse findById(Long id);

    /**
     * Lists all parking lots
     */
    List<ParkingLotResponse> findAll();

    /**
     * Deletes a parking lot by ID
     */
    void deleteParkingLot(Long id);

}
