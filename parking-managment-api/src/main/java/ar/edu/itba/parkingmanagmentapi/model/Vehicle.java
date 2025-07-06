package ar.edu.itba.parkingmanagmentapi.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "vehicle")
public class Vehicle {
    
    @Id
    @NotBlank(message = "La patente es obligatoria")
    @Size(max = 20, message = "La patente no puede exceder 20 caracteres")
    @Column(name = "license_plate", nullable = false, unique = true)
    private String licensePlate;
    
    @NotBlank(message = "La marca es obligatoria")
    @Size(max = 50, message = "La marca no puede exceder 50 caracteres")
    @Column(nullable = false)
    private String brand;
    
    @NotBlank(message = "El modelo es obligatorio")
    @Size(max = 50, message = "El modelo no puede exceder 50 caracteres")
    @Column(nullable = false)
    private String model;
    
    @NotBlank(message = "El tipo de vehículo es obligatorio")
    @Size(max = 30, message = "El tipo no puede exceder 30 caracteres")
    @Column(nullable = false)
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
    
    @OneToMany(mappedBy = "vehicle", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ScheduledReservation> scheduledReservations = new ArrayList<>();
    
    @OneToMany(mappedBy = "vehicle", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<WalkInStay> walkInStays = new ArrayList<>();
    
    // Constructores
    public Vehicle() {}
    
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
    
    public List<ScheduledReservation> getScheduledReservations() {
        return scheduledReservations;
    }
    
    public void setScheduledReservations(List<ScheduledReservation> scheduledReservations) {
        this.scheduledReservations = scheduledReservations;
    }
    
    public List<WalkInStay> getWalkInStays() {
        return walkInStays;
    }
    
    public void setWalkInStays(List<WalkInStay> walkInStays) {
        this.walkInStays = walkInStays;
    }
} 