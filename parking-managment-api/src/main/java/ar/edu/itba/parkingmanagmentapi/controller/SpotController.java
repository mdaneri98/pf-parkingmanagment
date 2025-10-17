package ar.edu.itba.parkingmanagmentapi.controller;

import ar.edu.itba.parkingmanagmentapi.dto.ApiResponse;
import ar.edu.itba.parkingmanagmentapi.dto.PageResponse;
import ar.edu.itba.parkingmanagmentapi.dto.SpotRequest;
import ar.edu.itba.parkingmanagmentapi.dto.SpotResponse;
import ar.edu.itba.parkingmanagmentapi.service.SpotService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/parking-lots/{parkingLotId}/spots")
@CrossOrigin(origins = "*")
public class SpotController {

    private final SpotService spotService;

    public SpotController(SpotService spotService) {
        this.spotService = spotService;
    }

    @PostMapping
    @PreAuthorize("@authorizationService.isCurrentUserManagerOfParkingLot(#parkingLotId)")
    public ResponseEntity<?> createSpot(@PathVariable Long parkingLotId, @RequestBody SpotRequest spot) {
        SpotResponse createdSpot = spotService.createSpot(parkingLotId, spot);
        return ApiResponse.created(createdSpot);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getSpotById(@PathVariable Long parkingLotId, @PathVariable Long id) {
        SpotResponse spot = spotService.findById(parkingLotId, id);
        return ApiResponse.ok(spot);
    }

    @PutMapping("/{id}")
    @PreAuthorize("@authorizationService.isCurrentUserManagerOfSpot(#id)")
    public ResponseEntity<?> updateSpot(@PathVariable Long parkingLotId, @PathVariable Long id, @RequestBody SpotRequest spot) {
        SpotResponse updatedSpot = spotService.updateSpot(parkingLotId, id, spot);
        return ApiResponse.ok(updatedSpot);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("@authorizationService.isCurrentUserManagerOfSpot(#id)")
    public ResponseEntity<?> deleteSpot(@PathVariable Long parkingLotId, @PathVariable Long id) {
        spotService.deleteSpot(parkingLotId, id);
        return ApiResponse.noContent();
    }

    @GetMapping
    public ResponseEntity<?> getSpots(
            @PathVariable Long parkingLotId,
            @RequestParam(required = false) Boolean available,
            @RequestParam(required = false) String vehicleType,
            @RequestParam(required = false) Integer floor,
            @RequestParam(required = false) Boolean isAccessible,
            @RequestParam(required = false) Boolean isReservable,
            Pageable pageable) {
        Page<SpotResponse> spots = spotService.findByFilters(parkingLotId, available, vehicleType, floor, isAccessible, isReservable, pageable);
        return ApiResponse.ok(PageResponse.of(spots));
    }
}

