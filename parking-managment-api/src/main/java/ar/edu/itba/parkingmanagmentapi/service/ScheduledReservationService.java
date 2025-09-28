package ar.edu.itba.parkingmanagmentapi.service;


import ar.edu.itba.parkingmanagmentapi.dto.ScheduledReservationRequest;
import ar.edu.itba.parkingmanagmentapi.dto.ScheduledReservationResponse;
import ar.edu.itba.parkingmanagmentapi.dto.enums.ReservationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;

public interface ScheduledReservationService {

    ScheduledReservationResponse createReservation(ScheduledReservationRequest request);

    ScheduledReservationResponse getReservation(Long id);

    Page<ScheduledReservationResponse> getReservationsByUser(Long userId, ReservationStatus status, String vehiclePlate, LocalDateTime from, LocalDateTime to, Pageable pageable);

    ScheduledReservationResponse updateReservationStatus(Long id, ReservationStatus status);

    Page<ScheduledReservationResponse> getScheduledReservationsByParkingLot(Long parkingLotId, ReservationStatus status, LocalDateTime from, LocalDateTime to, Pageable pageable);
}
