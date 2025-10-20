package ar.edu.itba.parkingmanagmentapi.dto.enums;

public enum ReservationStatus {
    PENDING("PENDING"),

    ACTIVE("ACTIVE"),
    CONFIRMED("CONFIRMED"),
    CANCELLED("CANCELLED"),
    COMPLETED("COMPLETED");


    private final String name;

    ReservationStatus(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }
}