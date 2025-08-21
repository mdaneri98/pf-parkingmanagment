package ar.edu.itba.parkingmanagmentapi.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class VehicleResponse {
    private String licensePlate;
    private String brand;
    private String model;
    private String type;
}
