package ar.edu.itba.parkingmanagmentapi.controller;

import ar.edu.itba.parkingmanagmentapi.dto.*;
import ar.edu.itba.parkingmanagmentapi.dto.enums.ReservationStatus;
import ar.edu.itba.parkingmanagmentapi.service.ParkingLotService;
import ar.edu.itba.parkingmanagmentapi.service.ScheduledReservationService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/parking-lots")
@CrossOrigin(origins = "*")
public class ParkingLotController {

    private final ParkingLotService parkingLotService;

    private final ScheduledReservationService reservationService;


    public ParkingLotController(ParkingLotService parkingLotService, ScheduledReservationService reservationService) {
        this.parkingLotService = parkingLotService;
        this.reservationService = reservationService;
    }

    @PostMapping
    public ResponseEntity<?> createParkingLot(
            @Valid @RequestBody ParkingLotRequest request) {
        ParkingLotResponse created = parkingLotService.createParkingLot(request);
        return ApiResponse.created(created);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getParkingLotById(@PathVariable Long id) {
        ParkingLotResponse parkingLot = parkingLotService.findById(id);
        return ApiResponse.ok(parkingLot);
    }

    @GetMapping
    public ResponseEntity<?> getParkingLots() {
        List<ParkingLotResponse> parkingLot = parkingLotService.findAll();
        return ApiResponse.ok(parkingLot);
    }

    @DeleteMapping("/{parkingLotId}")
    @PreAuthorize("@authorizationService.isCurrentUserManagerOfParkingLot(#parkingLotId)")
    public ResponseEntity<?> deleteParkingLot(@PathVariable Long parkingLotId) {
        parkingLotService.deleteParkingLot(parkingLotId);
        return ApiResponse.noContent();
    }

    @PutMapping("/{parkingLotId}")
    @PreAuthorize("@authorizationService.isCurrentUserManagerOfParkingLot(#parkingLotId)")
    public ResponseEntity<?> updateParkingLot(@PathVariable Long parkingLotId,
                                              @Valid @RequestBody UpdateParkingLotRequest request) {
        ParkingLotResponse updated = parkingLotService.updateParkingLot(parkingLotId, request);
        return ApiResponse.ok(updated);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getParkingLotsByUserId(@PathVariable Long userId) {
        List<ParkingLotResponse> parkingLots = parkingLotService.findByUserId(userId);
        return ApiResponse.ok(parkingLots);
    }

    @GetMapping("/{parkingLotId}/reservations")
    @PreAuthorize("@authorizationService.isCurrentUserManagerOfParkingLot(#parkingLotId)")
    public ResponseEntity<?> getScheduledReservationsByParkingLot(
            @PathVariable Long parkingLotId,
            @RequestParam(required = false) ReservationStatus status,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime from,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime to,
            Pageable pageable) {
        Page<ReservationResponse> reservations = reservationService.getReservationsByParkingLot(parkingLotId, status, null, from, to, pageable);
        return ApiResponse.ok(PageResponse.of(reservations));
    }


}

