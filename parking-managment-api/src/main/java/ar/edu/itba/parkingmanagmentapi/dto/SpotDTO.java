package ar.edu.itba.parkingmanagmentapi.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SpotDTO {
    private String vehicleType;
    private Integer floor;
    private String code;
    private Boolean isAvailable;
}
