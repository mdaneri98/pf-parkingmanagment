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
public class ParkingLotResponse {
    private Long id;
    private String name;
    private String address;
    private String imageUrl;
    private List<SpotResponse> spots;
}
