package ar.edu.itba.parkingmanagmentapi.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "user_vehicle_assignment")
public class UserVehicleAssignment {

    @EmbeddedId
    private UserVehicleAssignmentId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("userId")
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("vehicleLicensePlate")
    @JoinColumn(name = "vehicle_license_plate", nullable = false)
    private Vehicle vehicle;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "userVehicleAssignment", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private final List<ScheduledReservation> scheduledReservations = new ArrayList<>();

    @OneToMany(mappedBy = "userVehicleAssignment", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private final List<WalkInStay> walkInStays = new ArrayList<>();


    // Constructores
    public UserVehicleAssignment() {
        this.id = new UserVehicleAssignmentId();
    }

    public UserVehicleAssignment(User user, Vehicle vehicle) {
        this.user = user;
        this.vehicle = vehicle;
        this.id = new UserVehicleAssignmentId(user.getId(), vehicle.getLicensePlate());
    }

    // Getters y Setters
    public UserVehicleAssignmentId getId() {
        return id;
    }

    public void setId(UserVehicleAssignmentId id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
        if (this.id == null) {
            this.id = new UserVehicleAssignmentId();
        }
        this.id.setUserId(user.getId());
    }

    public Vehicle getVehicle() {
        return vehicle;
    }

    public void setVehicle(Vehicle vehicle) {
        this.vehicle = vehicle;
        if (this.id == null) {
            this.id = new UserVehicleAssignmentId();
        }
        this.id.setVehicleLicensePlate(vehicle.getLicensePlate());
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
} 