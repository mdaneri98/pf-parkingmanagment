package ar.edu.itba.parkingmanagmentapi.dto;

import ar.edu.itba.parkingmanagmentapi.dto.enums.ReservationStatus;
import ar.edu.itba.parkingmanagmentapi.model.ScheduledReservation;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ScheduledReservationResponse {

    private Long id;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime reservedStartTime;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime expectedEndTime;
    private ReservationStatus status;
    private BigDecimal estimatedPrice;
    private Long spotId;
    private String vehicleLicensePlate;
    private Long userId;

    public static ScheduledReservationResponse fromEntity(ScheduledReservation entity) {
        ScheduledReservationResponse response = new ScheduledReservationResponse();
        response.setId(entity.getId());
        response.setReservedStartTime(entity.getReservedStartTime());
        response.setExpectedEndTime(entity.getExpectedEndTime());
        response.setStatus(entity.getStatus());
        response.setEstimatedPrice(entity.getEstimatedPrice());
        response.setSpotId(entity.getSpot().getId());
        response.setVehicleLicensePlate(entity.getUserVehicleAssignment().getVehicle().getLicensePlate());
        response.setUserId(entity.getUserVehicleAssignment().getUser().getId());
        return response;
    }

}
