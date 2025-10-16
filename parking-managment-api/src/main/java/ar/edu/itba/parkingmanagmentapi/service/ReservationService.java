package ar.edu.itba.parkingmanagmentapi.service;

import ar.edu.itba.parkingmanagmentapi.dto.ReservationResponse;
import ar.edu.itba.parkingmanagmentapi.dto.enums.ReservationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;

public interface ReservationService<T> {

    ReservationResponse createReservation(T request);

    ReservationResponse updateReservationStatus(Long reservationId, ReservationStatus status);

    ReservationResponse getReservation(Long id);

    Page<ReservationResponse> getReservationsByUser(Long userId, ReservationStatus status, String licensePlate, LocalDateTime from, LocalDateTime to, Pageable pageable);

    Page<ReservationResponse> getReservationsByParkingLot(Long parkingLotId, ReservationStatus status, String licensePlate, LocalDateTime from, LocalDateTime to, Pageable pageable);

}
