package ar.edu.itba.parkingmanagmentapi.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "scheduled_reservation")
public class ScheduledReservation {
    
    public enum ReservationStatus {
        PENDING, CONFIRMED, CANCELLED, COMPLETED, IN_PROGRESS
    }
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull(message = "La fecha de inicio de la reserva es obligatoria")
    @Column(name = "reserved_start_time", nullable = false)
    private LocalDateTime reservedStartTime;
    
    @NotNull(message = "La fecha de fin esperada es obligatoria")
    @Column(name = "expected_end_time", nullable = false)
    private LocalDateTime expectedEndTime;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReservationStatus status = ReservationStatus.PENDING;
    
    @NotNull(message = "El precio estimado es obligatorio")
    @DecimalMin(value = "0.0", inclusive = false, message = "El precio estimado debe ser mayor a 0")
    @Column(name = "estimated_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal estimatedPrice;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "spot_id", nullable = false)
    private Spot spot;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_license_plate", nullable = false)
    private Vehicle vehicle;
    
    @OneToMany(mappedBy = "scheduledReservation", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Incident> incidents = new ArrayList<>();
    
    // Constructores
    public ScheduledReservation() {}
    
    public ScheduledReservation(LocalDateTime reservedStartTime, LocalDateTime expectedEndTime, 
                               BigDecimal estimatedPrice, Spot spot, User user, Vehicle vehicle) {
        this.reservedStartTime = reservedStartTime;
        this.expectedEndTime = expectedEndTime;
        this.estimatedPrice = estimatedPrice;
        this.spot = spot;
        this.user = user;
        this.vehicle = vehicle;
        this.status = ReservationStatus.PENDING;
    }
    
    // Getters y Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public LocalDateTime getReservedStartTime() {
        return reservedStartTime;
    }
    
    public void setReservedStartTime(LocalDateTime reservedStartTime) {
        this.reservedStartTime = reservedStartTime;
    }
    
    public LocalDateTime getExpectedEndTime() {
        return expectedEndTime;
    }
    
    public void setExpectedEndTime(LocalDateTime expectedEndTime) {
        this.expectedEndTime = expectedEndTime;
    }
    
    public ReservationStatus getStatus() {
        return status;
    }
    
    public void setStatus(ReservationStatus status) {
        this.status = status;
    }
    
    public BigDecimal getEstimatedPrice() {
        return estimatedPrice;
    }
    
    public void setEstimatedPrice(BigDecimal estimatedPrice) {
        this.estimatedPrice = estimatedPrice;
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
    
    public Spot getSpot() {
        return spot;
    }
    
    public void setSpot(Spot spot) {
        this.spot = spot;
    }
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }
    
    public Vehicle getVehicle() {
        return vehicle;
    }
    
    public void setVehicle(Vehicle vehicle) {
        this.vehicle = vehicle;
    }
    
    public List<Incident> getIncidents() {
        return incidents;
    }
    
    public void setIncidents(List<Incident> incidents) {
        this.incidents = incidents;
    }
} 