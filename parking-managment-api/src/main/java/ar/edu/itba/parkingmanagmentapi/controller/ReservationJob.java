package ar.edu.itba.parkingmanagmentapi.controller;

import ar.edu.itba.parkingmanagmentapi.dto.ReservationResponse;
import ar.edu.itba.parkingmanagmentapi.service.ScheduledReservationService;
import ar.edu.itba.parkingmanagmentapi.service.WalkInStayService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ReservationJob {

    private final WalkInStayService walkInStayService;

    private final ScheduledReservationService scheduledReservationService;


    public ReservationJob(WalkInStayService walkInStayService, ScheduledReservationService scheduledReservationService) {
        this.walkInStayService = walkInStayService;
        this.scheduledReservationService = scheduledReservationService;
    }

    @Scheduled(fixedRate = 60000) // cada 1 min
    public void sendReminders() {
        List<ReservationResponse> expiring = walkInStayService.getExpiringReservations();
        expiring.forEach(stay -> {
            System.out.println("Reminder: Stay " + stay.getId() + " is expiring soon!");
        });
    }

    /*@Scheduled(fixedRate = 60000) // cada 1 minuto
    public void activateReservations() {
        LocalDateTime now = LocalDateTime.now();
        List<ReservationResponse> toActivate = scheduledReservationService.checkInReservation(now);
    }*/
}
