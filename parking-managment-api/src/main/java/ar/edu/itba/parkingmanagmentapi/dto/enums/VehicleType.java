package ar.edu.itba.parkingmanagmentapi.dto.enums;

public enum VehicleType {
    BICYCLE("bicicleta"),
    CAR("auto"),
    VAN("camioneta"),
    MOTORCYCLE("moto");

    private final String name;

    VehicleType(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }
}
