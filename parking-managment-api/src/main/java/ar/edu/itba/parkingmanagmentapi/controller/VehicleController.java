package ar.edu.itba.parkingmanagmentapi.controller;

import ar.edu.itba.parkingmanagmentapi.dto.ApiResponse;
import ar.edu.itba.parkingmanagmentapi.dto.VehicleRequest;
import ar.edu.itba.parkingmanagmentapi.dto.VehicleResponse;
import ar.edu.itba.parkingmanagmentapi.service.VehicleService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/vehicles")
@CrossOrigin(origins = "*")
public class VehicleController {

    private final VehicleService vehicleService;

    public VehicleController(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }

    @PostMapping

    public ResponseEntity<?> createVehicle(@Valid @RequestBody VehicleRequest request) {
        VehicleResponse response = vehicleService.create(request);
        return ApiResponse.created(response);
    }

    @GetMapping("/{licensePlate}")
    @PreAuthorize("@authorizationService.isCurrentUserOwnerOfVehicle(#licensePlate)")
    public ResponseEntity<?> getVehicle(@PathVariable String licensePlate) {
        VehicleResponse response = vehicleService.findByLicensePlate(licensePlate);
        return ApiResponse.ok(response);
    }

    @PutMapping("/{licensePlate}")
    @PreAuthorize("@authorizationService.isCurrentUserOwnerOfVehicle(#licensePlate)")
    public ResponseEntity<?> updateVehicle(
            @PathVariable String licensePlate,
            @Valid @RequestBody VehicleRequest request) {
        VehicleResponse response = vehicleService.update(licensePlate, request);
        return ApiResponse.ok(response);
    }

    @DeleteMapping("/{licensePlate}")
    @PreAuthorize("@authorizationService.isCurrentUserOwnerOfVehicle(#licensePlate)")
    public ResponseEntity<?> deleteVehicle(@PathVariable String licensePlate) {
        vehicleService.delete(licensePlate);
        return ApiResponse.noContent();
    }
}

