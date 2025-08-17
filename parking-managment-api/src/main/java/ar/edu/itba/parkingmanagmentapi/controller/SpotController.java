package ar.edu.itba.parkingmanagmentapi.controller;

import ar.edu.itba.parkingmanagmentapi.dto.ApiResponse;
import ar.edu.itba.parkingmanagmentapi.dto.SpotRequest;
import ar.edu.itba.parkingmanagmentapi.dto.SpotResponse;
import ar.edu.itba.parkingmanagmentapi.service.SpotService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/spots")
@CrossOrigin(origins = "*")
public class SpotController {

    private final SpotService spotService;

    public SpotController(SpotService spotService) {
        this.spotService = spotService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<SpotResponse>> createSpot(@RequestBody SpotRequest spot) {
        SpotResponse createdSpot = spotService.createSpot(spot);
        return ApiResponse.created(createdSpot);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SpotResponse>> getSpotById(@PathVariable Long id) {
        SpotResponse spot = spotService.findById(id);
        return ApiResponse.ok(spot);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<SpotResponse>> updateSpot(@PathVariable Long id, @RequestBody SpotRequest spot) {
        SpotResponse updatedSpot = spotService.updateSpot(id, spot);
        return ApiResponse.ok(updatedSpot);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteSpot(@PathVariable Long id) {
        spotService.deleteSpot(id);
        return ApiResponse.noContent();
    }
}

