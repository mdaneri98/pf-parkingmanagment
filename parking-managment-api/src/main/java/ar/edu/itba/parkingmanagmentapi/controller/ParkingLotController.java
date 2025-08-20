package ar.edu.itba.parkingmanagmentapi.controller;

import ar.edu.itba.parkingmanagmentapi.dto.*;
import ar.edu.itba.parkingmanagmentapi.service.ParkingLotService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    @GetMapping
    public ResponseEntity<ApiResponse<List<ParkingLotResponse>>> getAllParkingLots() {
        List<ParkingLotResponse> list = parkingLotService.findAll();
        return ApiResponse.ok(list);
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

    @GetMapping("/{parkingLotId}/spots")
    public ResponseEntity<ApiResponse<PageResponse<SpotResponse>>> getSpots(
            @PathVariable Long parkingLotId,
            @RequestParam(required = false) Boolean available,
            @RequestParam(required = false) String vehicleType,
            @RequestParam(required = false) Integer floor,
            Pageable pageable) {
        Page<SpotResponse> spots = parkingLotService.findByFilters(parkingLotId, available, vehicleType, floor, pageable);
        return ApiResponse.ok(PageResponse.of(spots));
    }
}

