package ar.edu.itba.parkingmanagmentapi.service;

import ar.edu.itba.parkingmanagmentapi.dto.ReservationResponse;
import ar.edu.itba.parkingmanagmentapi.dto.WalkInStayRequest;

import java.time.Duration;
import java.util.List;

public interface WalkInStayService extends ReservationService<WalkInStayRequest> {
    ReservationResponse extendReservation(Long id, int extraHours);

    Duration getRemainingTime(Long id);

    List<ReservationResponse> getExpiringReservations();

}
