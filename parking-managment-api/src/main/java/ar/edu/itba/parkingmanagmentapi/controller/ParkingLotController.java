package ar.edu.itba.parkingmanagmentapi.controller;

import ar.edu.itba.parkingmanagmentapi.dto.ApiResponse;
import ar.edu.itba.parkingmanagmentapi.dto.ParkingLotRequest;
import ar.edu.itba.parkingmanagmentapi.dto.ParkingLotResponse;
import ar.edu.itba.parkingmanagmentapi.dto.UpdateParkingLotRequest;
import ar.edu.itba.parkingmanagmentapi.service.ParkingLotService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
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

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteParkingLot(@PathVariable Long id) {
        parkingLotService.deleteParkingLot(id);
        return ApiResponse.noContent();
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ParkingLotResponse>> updateParkingLot(@PathVariable Long id,
                                                                            @Valid @RequestBody UpdateParkingLotRequest request) {
        ParkingLotResponse updated = parkingLotService.updateParkingLot(id, request);
        return ApiResponse.ok(updated);
    }
}

