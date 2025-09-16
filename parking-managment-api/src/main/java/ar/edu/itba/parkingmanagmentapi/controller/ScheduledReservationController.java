package ar.edu.itba.parkingmanagmentapi.controller;

import ar.edu.itba.parkingmanagmentapi.dto.ApiResponse;
import ar.edu.itba.parkingmanagmentapi.dto.PageResponse;
import ar.edu.itba.parkingmanagmentapi.dto.ScheduledReservationRequest;
import ar.edu.itba.parkingmanagmentapi.dto.ScheduledReservationResponse;
import ar.edu.itba.parkingmanagmentapi.dto.enums.ReservationStatus;
import ar.edu.itba.parkingmanagmentapi.service.ScheduledReservationService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/reservations/scheduled")
@CrossOrigin(origins = "*")
public class ScheduledReservationController {

    private final ScheduledReservationService reservationService;

    public ScheduledReservationController(ScheduledReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @PostMapping
    public ResponseEntity<?> createReservation(@Valid @RequestBody ScheduledReservationRequest request) {
        ScheduledReservationResponse response = reservationService.createReservation(request);
        return ApiResponse.created(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getReservation(@PathVariable Long id) {
        ScheduledReservationResponse response = reservationService.getReservation(id);
        return ApiResponse.ok(response);
    }

    @GetMapping
    @PreAuthorize("@authorizationService.isCurrentUser(#userId)")
    public ResponseEntity<?> getReservationsByUser(
            Long userId,
            @RequestParam(required = false, defaultValue = "PENDING") ReservationStatus status,
            @RequestParam(required = false) String vehiclePlate,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime from,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime to,
            Pageable pageable) {
        Page<ScheduledReservationResponse> responses = reservationService.getReservationsByUser(userId, status, vehiclePlate, from, to, pageable);
        return ApiResponse.ok(PageResponse.of(responses));
    }

    @PostMapping("/{id}/cancel")
    @PreAuthorize("@authorizationService.isCurrentUserOwnerOfReservation(#id)")
    public ResponseEntity<?> cancelReservation(@PathVariable Long id) {
        ScheduledReservationResponse response = reservationService.cancelReservation(id);
        return ApiResponse.ok(response);
    }
}
