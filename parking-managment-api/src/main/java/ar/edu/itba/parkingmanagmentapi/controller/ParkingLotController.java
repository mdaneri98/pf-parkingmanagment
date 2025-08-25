package ar.edu.itba.parkingmanagmentapi.controller;

import ar.edu.itba.parkingmanagmentapi.dto.ApiResponse;
import ar.edu.itba.parkingmanagmentapi.dto.ParkingLotRequest;
import ar.edu.itba.parkingmanagmentapi.dto.ParkingLotResponse;
import ar.edu.itba.parkingmanagmentapi.dto.UpdateParkingLotRequest;
import ar.edu.itba.parkingmanagmentapi.service.ParkingLotService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/parking-lots")
@CrossOrigin(origins = "*")
public class ParkingLotController {

    private final ParkingLotService parkingLotService;

    public ParkingLotController(ParkingLotService parkingLotService) {
        this.parkingLotService = parkingLotService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ParkingLotResponse>> createParkingLot(
            @Valid @RequestBody ParkingLotRequest request) {
        ParkingLotResponse created = parkingLotService.createParkingLot(request);
        return ApiResponse.created(created);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ParkingLotResponse>> getParkingLotById(@PathVariable Long id) {
        ParkingLotResponse parkingLot = parkingLotService.findById(id);
        return ApiResponse.ok(parkingLot);
    }

    @DeleteMapping("/{parkingLotId}")
    @PreAuthorize("@authorizationService.isCurrentUserManagerOfParkingLot(#parkingLotId)")
    public ResponseEntity<ApiResponse<Void>> deleteParkingLot(@PathVariable Long parkingLotId) {
        parkingLotService.deleteParkingLot(parkingLotId);
        return ApiResponse.noContent();
    }

    @PutMapping("/{parkingLotId}")
    @PreAuthorize("@authorizationService.isCurrentUserManagerOfParkingLot(#parkingLotId)")
    public ResponseEntity<ApiResponse<ParkingLotResponse>> updateParkingLot(@PathVariable Long parkingLotId,
                                                                            @Valid @RequestBody UpdateParkingLotRequest request) {
        ParkingLotResponse updated = parkingLotService.updateParkingLot(parkingLotId, request);
        return ApiResponse.ok(updated);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<ParkingLotResponse>>> getParkingLotsByUserId(@PathVariable Long userId) {
        List<ParkingLotResponse> parkingLots = parkingLotService.findByUserId(userId);
        return ApiResponse.ok(parkingLots);
    }

}

