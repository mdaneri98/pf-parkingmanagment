package ar.edu.itba.parkingmanagmentapi.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SpotRequest {
    private String vehicleType;

    private Integer floor;

    private String code;

    private Boolean isAvailable;

    private Boolean isReservable;

    private Boolean isAccessible;
}
