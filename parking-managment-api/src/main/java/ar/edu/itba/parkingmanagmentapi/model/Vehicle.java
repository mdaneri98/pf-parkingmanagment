package ar.edu.itba.parkingmanagmentapi.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "vehicle")
public class Vehicle {

    @Id
    @Column(name = "license_plate", nullable = false, unique = true)
    private String licensePlate;

    @Column(nullable = true)
    private String brand;

    @Column(nullable = true)
    private String model;

    @Column(nullable = true)
    private String type;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Relaciones
    @OneToMany(mappedBy = "vehicle", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<UserVehicleAssignment> userAssignments = new ArrayList<>();

    // Constructores
    public Vehicle() {
    }

    public Vehicle(String licensePlate, String brand, String model, String type) {
        this.licensePlate = licensePlate;
        this.brand = brand;
        this.model = model;
        this.type = type;
    }

    // Getters y Setters
    public String getLicensePlate() {
        return licensePlate;
    }

    public void setLicensePlate(String licensePlate) {
        this.licensePlate = licensePlate;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
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

    public List<UserVehicleAssignment> getUserAssignments() {
        return userAssignments;
    }

    public void setUserAssignments(List<UserVehicleAssignment> userAssignments) {
        this.userAssignments = userAssignments;
    }
} 