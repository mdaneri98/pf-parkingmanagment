package ar.edu.itba.parkingmanagmentapi.controller;

import ar.edu.itba.parkingmanagmentapi.dto.ApiResponse;
import ar.edu.itba.parkingmanagmentapi.dto.ParkingPriceRequest;
import ar.edu.itba.parkingmanagmentapi.dto.ParkingPriceResponse;
import ar.edu.itba.parkingmanagmentapi.service.ParkingPriceService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/parking-lots/{parkingLotId}/prices")
@CrossOrigin(origins = "*")
public class ParkingPriceController {

    private final ParkingPriceService parkingPriceService;

    public ParkingPriceController(ParkingPriceService parkingPriceService) {
        this.parkingPriceService = parkingPriceService;
    }

    @PostMapping
    @PreAuthorize("@authorizationService.isCurrentUserManagerOfParkingLot(#parkingLotId)")
    public ResponseEntity<?> create(
            @PathVariable Long parkingLotId,
            @Valid @RequestBody ParkingPriceRequest request) {
        ParkingPriceResponse response = parkingPriceService.create(parkingLotId, request);
        return ApiResponse.created(response);
    }

    @PutMapping("/{id}")
    @PreAuthorize("@authorizationService.isCurrentUserManagerOfParkingLot(#parkingLotId)")
    public ResponseEntity<?> update(
            @PathVariable Long parkingLotId,
            @PathVariable Long id,
            @Valid @RequestBody ParkingPriceRequest request
    ) {
        ParkingPriceResponse response = parkingPriceService.update(parkingLotId, id, request);
        return ApiResponse.ok(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("@authorizationService.isCurrentUserManagerOfParkingLot(#parkingLotId)")
    public ResponseEntity<?> delete(
            @PathVariable Long parkingLotId,
            @PathVariable Long id
    ) {
        parkingPriceService.delete(parkingLotId, id);
        return ApiResponse.noContent();
    }

    @GetMapping
    public ResponseEntity<?> searchPrices(
            @PathVariable Long parkingLotId,
            @RequestParam(required = false) BigDecimal min,
            @RequestParam(required = false) BigDecimal max,
            @RequestParam(required = false) String vehicleType,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to,
            @RequestParam(defaultValue = "asc") String sort
    ) {
        List<ParkingPriceResponse> responses = parkingPriceService.getByFilters(parkingLotId, min, max, vehicleType, from, to, sort);
        return ApiResponse.ok(responses);
    }
}
