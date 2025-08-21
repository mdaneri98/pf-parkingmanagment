package ar.edu.itba.parkingmanagmentapi.service;

import ar.edu.itba.parkingmanagmentapi.dto.VehicleRequest;
import ar.edu.itba.parkingmanagmentapi.dto.VehicleResponse;

import java.util.List;

public interface VehicleService {

    VehicleResponse create(VehicleRequest request);

    VehicleResponse findByLicensePlate(String licensePlate);

    List<VehicleResponse> findAll();

    VehicleResponse update(String licensePlate, VehicleRequest request);

    void delete(String licensePlate);

    boolean isUserOwnerOfVehicle(Long userId, String licensePlate);
}
