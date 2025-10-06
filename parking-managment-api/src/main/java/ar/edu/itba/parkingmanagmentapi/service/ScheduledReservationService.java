package ar.edu.itba.parkingmanagmentapi.service;

import ar.edu.itba.parkingmanagmentapi.dto.ReservationResponse;
import ar.edu.itba.parkingmanagmentapi.dto.ScheduledReservationRequest;

import java.time.LocalDateTime;
import java.util.List;

public interface ScheduledReservationService extends ReservationService<ScheduledReservationRequest> {
    List<ReservationResponse> checkInReservation(LocalDateTime checkInTime);
}
