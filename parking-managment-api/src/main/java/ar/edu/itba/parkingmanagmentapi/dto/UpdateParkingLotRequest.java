package ar.edu.itba.parkingmanagmentapi.dto;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateParkingLotRequest {
    private String name;
    private String address;
    private String imageUrl;
    private Double latitude;
    private Double longitude;
}
