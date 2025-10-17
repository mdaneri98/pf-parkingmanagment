package ar.edu.itba.parkingmanagmentapi.service;

import ar.edu.itba.parkingmanagmentapi.dto.VehicleRequest;
import ar.edu.itba.parkingmanagmentapi.dto.VehicleResponse;
import ar.edu.itba.parkingmanagmentapi.model.Vehicle;

import java.util.List;

public interface VehicleService {

    VehicleResponse create(VehicleRequest request);

    VehicleResponse findByLicensePlate(String licensePlate);

    List<VehicleResponse> findAllVehiclesByUser(Long id);

    VehicleResponse update(String licensePlate, VehicleRequest request);

    void delete(String licensePlate);

    boolean isUserOwnerOfVehicle(Long userId, String licensePlate);

    // -------------------------- RAW ENTITIES --------------------------

    Vehicle findEntityByLicensePlate(String licensePlate);

    Vehicle findEntityByLicensePlateOrCreate(Vehicle vehicle);

}
