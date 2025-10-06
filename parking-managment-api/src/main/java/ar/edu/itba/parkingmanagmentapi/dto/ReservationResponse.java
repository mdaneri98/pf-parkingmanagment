package ar.edu.itba.parkingmanagmentapi.dto;

import ar.edu.itba.parkingmanagmentapi.dto.enums.ReservationStatus;
import ar.edu.itba.parkingmanagmentapi.model.ScheduledReservation;
import ar.edu.itba.parkingmanagmentapi.model.WalkInStay;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Objects;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ReservationResponse {

    private Long id;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime reservedStartTime;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime expectedEndTime;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime reservedEndTime;
    private ReservationStatus status;
    private BigDecimal price;
    private Long spotId;
    private String vehicleLicensePlate;
    private Long userId;

    private Integer floor;
    private String spotCode;

    private String userName;
    private String userLastName;
    private String brand;
    private String model;
    private String type;

    public static ReservationResponse fromScheduledReservation(ScheduledReservation entity) {
        ReservationResponse response = new ReservationResponse();
        response.setId(entity.getId());
        response.setReservedStartTime(entity.getReservedStartTime());
        response.setExpectedEndTime(entity.getExpectedEndTime());
        response.setStatus(entity.getStatus());
        response.setPrice(entity.getEstimatedPrice());
        response.setSpotId(Objects.nonNull(entity.getSpot()) ? entity.getSpot().getId() : null);
        response.setVehicleLicensePlate(entity.getUserVehicleAssignment().getVehicle().getLicensePlate());
        response.setUserId(entity.getUserVehicleAssignment().getUser().getId());
        return response;
    }

    public static ReservationResponse fromWalkInStay(WalkInStay entity) {
        ReservationResponse response = new ReservationResponse();
        response.setId(entity.getId());
        response.setReservedStartTime(entity.getCheckInTime());
        response.setExpectedEndTime(entity.getExpectedEndTime());
        response.setReservedEndTime(entity.getCheckOutTime());
        response.setStatus(entity.getStatus());
        response.setPrice(entity.getTotalPrice());
        response.setSpotId(Objects.nonNull(entity.getSpot()) ? entity.getSpot().getId() : null);
        response.setVehicleLicensePlate(entity.getUserVehicleAssignment().getVehicle().getLicensePlate());
        response.setUserId(entity.getUserVehicleAssignment().getUser().getId());
        return response;
    }

    public static ReservationResponse fromEntityToGet(ScheduledReservation entity) {
        ReservationResponse response = new ReservationResponse();
        response.setId(entity.getId());
        response.setReservedStartTime(entity.getReservedStartTime());
        response.setExpectedEndTime(entity.getExpectedEndTime());
        response.setStatus(entity.getStatus());
        response.setPrice(entity.getEstimatedPrice());
        if (Objects.nonNull(entity.getSpot())) {
            response.setSpotId(entity.getSpot().getId());
            response.setFloor(entity.getSpot().getFloor());
            response.setSpotCode(entity.getSpot().getCode());
        } else {
            response.setFloor(entity.getSpotFloorSnapshot());
            response.setSpotCode(entity.getSpotCodeSnapshot());
        }
        response.setVehicleLicensePlate(entity.getUserVehicleAssignment().getVehicle().getLicensePlate());
        response.setUserId(entity.getUserVehicleAssignment().getUser().getId());
        response.setUserName(entity.getUserVehicleAssignment().getUser().getFirstName());
        response.setUserLastName(entity.getUserVehicleAssignment().getUser().getLastName());
        response.setBrand(entity.getUserVehicleAssignment().getVehicle().getBrand());
        response.setModel(entity.getUserVehicleAssignment().getVehicle().getModel());
        response.setType(entity.getUserVehicleAssignment().getVehicle().getType());
        return response;
    }

}
