package ar.edu.itba.parkingmanagmentapi.controller;

import ar.edu.itba.parkingmanagmentapi.dto.ApiResponse;
import ar.edu.itba.parkingmanagmentapi.dto.PageResponse;
import ar.edu.itba.parkingmanagmentapi.dto.ReservationResponse;
import ar.edu.itba.parkingmanagmentapi.dto.WalkInStayRequest;
import ar.edu.itba.parkingmanagmentapi.dto.enums.ReservationStatus;
import ar.edu.itba.parkingmanagmentapi.service.WalkInStayService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/reservations/walk-in")
@CrossOrigin(origins = "*")
public class WalkInStayController {

    private final WalkInStayService walkInStayService;

    public WalkInStayController(WalkInStayService walkInStayService) {
        this.walkInStayService = walkInStayService;
    }

    @PostMapping
    @PreAuthorize("@authorizationService.isCurrentUserManagerOfSpot(#request.spotId)")
    public ResponseEntity<?> createWalkInStay(@Valid @RequestBody WalkInStayRequest request) {
        ReservationResponse response = walkInStayService.createReservation(request);
        return ApiResponse.created(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getWalkInStay(@PathVariable Long id) {
        ReservationResponse response = walkInStayService.getReservation(id);
        return ApiResponse.ok(response);
    }

    @GetMapping
    @PreAuthorize("@authorizationService.isCurrentUser(#userId)")
    public ResponseEntity<?> getWalkInStaysByUser(
            Long userId,
            @RequestParam(required = false, defaultValue = "ACTIVE") ReservationStatus status,
            @RequestParam(required = false) String vehiclePlate,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime from,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime to,
            Pageable pageable) {
        Page<ReservationResponse> responses =
                walkInStayService.getReservationsByUser(userId, status, vehiclePlate, from, to, pageable);
        return ApiResponse.ok(PageResponse.of(responses));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("@authorizationService.isCurrentUserManagerOfReservation(#id)")
    public ResponseEntity<?> updateWalkInStayStatus(
            @PathVariable Long id,
            @RequestParam ReservationStatus status
    ) {
        ReservationResponse response = walkInStayService.updateReservationStatus(id, status);
        return ApiResponse.ok(response);
    }

    @PatchMapping("/{id}/extend")
    @PreAuthorize("@authorizationService.canCurrentUserUpdateWalkInStayReservation(#id)")
    public ResponseEntity<?> extend(
            @PathVariable Long id,
            @RequestParam int extraHours) {
        return ApiResponse.ok(walkInStayService.extendReservation(id, extraHours));
    }

    @GetMapping("/{id}/remaining-time")
    public ResponseEntity<?> remainingTime(@PathVariable Long id) {
        Duration remaining = walkInStayService.getRemainingTime(id);
        return ApiResponse.ok("Remaining: " + remaining.toMinutes() + " minutes");
    }
}
