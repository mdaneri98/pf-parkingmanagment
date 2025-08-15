package ar.edu.itba.parkingmanagmentapi.util;

import ar.edu.itba.parkingmanagmentapi.dto.ParkingLotResponse;
import ar.edu.itba.parkingmanagmentapi.dto.SpotDTO;
import ar.edu.itba.parkingmanagmentapi.model.ParkingLot;
import ar.edu.itba.parkingmanagmentapi.model.Spot;

import java.util.Collections;
import java.util.Objects;
import java.util.stream.Collectors;

public class ParkingLotMapper {
    public static ParkingLotResponse toParkingLotResponse(ParkingLot parkingLot) {
        if (parkingLot == null) return null;

        ParkingLotResponse dto = new ParkingLotResponse();
        dto.setId(parkingLot.getId());
        dto.setName(parkingLot.getName());
        dto.setAddress(parkingLot.getAddress());
        dto.setImageUrl(parkingLot.getImageUrl());

        if (parkingLot.getSpots() != null) {
            dto.setSpots(parkingLot.getSpots().stream()
                    .map(ParkingLotMapper::toSpotDTO)
                    .collect(Collectors.toList()));
        } else {
            dto.setSpots(Collections.emptyList());
        }

        return dto;
    }

    public static SpotDTO toSpotDTO(Spot spot) {
        if (Objects.isNull(spot)) return null;

        SpotDTO dto = new SpotDTO();
        dto.setVehicleType(spot.getVehicleType());
        dto.setFloor(spot.getFloor());
        dto.setCode(spot.getCode());
        return dto;
    }
}
