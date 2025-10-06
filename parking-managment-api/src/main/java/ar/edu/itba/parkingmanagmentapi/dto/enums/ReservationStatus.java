package ar.edu.itba.parkingmanagmentapi.dto.enums;

public enum ReservationStatus {
    PENDING("PENDING"),

    ACTIVE("ACTIVE"),
    CONFIRMED("CONFIRMED"),
    CANCELLED("CANCELLED"),
    COMPLETED("COMPLETED"),
    IN_PROGRESS("IN_PROGRESS");


    private final String name;

    ReservationStatus(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }
}