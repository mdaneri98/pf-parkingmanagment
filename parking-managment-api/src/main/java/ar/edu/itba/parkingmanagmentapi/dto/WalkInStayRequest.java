package ar.edu.itba.parkingmanagmentapi.dto;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class WalkInStayRequest {
    private Long spotId;
    private String vehicleLicensePlate;
    private Integer expectedDurationHours;
}
