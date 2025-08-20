package ar.edu.itba.parkingmanagmentapi.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ParkingLotRequest {
    private String name;
    private String address;
    private String imageUrl;
    //TODO: serán agregadas por API?
    private Double latitude;
    private Double longitude;
    private List<SpotRequest> spots;
}
