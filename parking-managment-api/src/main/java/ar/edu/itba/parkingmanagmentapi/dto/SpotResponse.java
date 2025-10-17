package ar.edu.itba.parkingmanagmentapi.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SpotResponse {
    private Long id;
    private String vehicleType;
    private Integer floor;
    private String code;
    private Boolean isAvailable;
    private Boolean isReservable;
    private Boolean isAccessible;
}
