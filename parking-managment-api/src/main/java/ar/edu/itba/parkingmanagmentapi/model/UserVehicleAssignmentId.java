package ar.edu.itba.parkingmanagmentapi.model;

import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class UserVehicleAssignmentId implements Serializable {
    
    private Long userId;
    private String vehicleLicensePlate;
    
    // Constructores
    public UserVehicleAssignmentId() {}
    
    public UserVehicleAssignmentId(Long userId, String vehicleLicensePlate) {
        this.userId = userId;
        this.vehicleLicensePlate = vehicleLicensePlate;
    }
    
    // Getters y Setters
    public Long getUserId() {
        return userId;
    }
    
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    
    public String getVehicleLicensePlate() {
        return vehicleLicensePlate;
    }
    
    public void setVehicleLicensePlate(String vehicleLicensePlate) {
        this.vehicleLicensePlate = vehicleLicensePlate;
    }
    
    // equals y hashCode
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserVehicleAssignmentId that = (UserVehicleAssignmentId) o;
        return Objects.equals(userId, that.userId) &&
               Objects.equals(vehicleLicensePlate, that.vehicleLicensePlate);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(userId, vehicleLicensePlate);
    }
} 