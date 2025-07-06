package ar.edu.itba.parkingmanagmentapi.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "incident")
public class Incident {
    
    public enum IncidentStatus {
        REPORTED, IN_PROGRESS, RESOLVED, CLOSED
    }
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "La descripción del incidente es obligatoria")
    @Size(max = 1000, message = "La descripción no puede exceder 1000 caracteres")
    @Column(nullable = false)
    private String description;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private IncidentStatus status = IncidentStatus.REPORTED;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "walk_in_stay_id")
    private WalkInStay walkInStay;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "scheduled_reservation_id")
    private ScheduledReservation scheduledReservation;
    
    // Constructores
    public Incident() {}
    
    public Incident(String description, WalkInStay walkInStay) {
        this.description = description;
        this.walkInStay = walkInStay;
        this.status = IncidentStatus.REPORTED;
    }
    
    public Incident(String description, ScheduledReservation scheduledReservation) {
        this.description = description;
        this.scheduledReservation = scheduledReservation;
        this.status = IncidentStatus.REPORTED;
    }
    
    // Getters y Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public IncidentStatus getStatus() {
        return status;
    }
    
    public void setStatus(IncidentStatus status) {
        this.status = status;
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
    
    public WalkInStay getWalkInStay() {
        return walkInStay;
    }
    
    public void setWalkInStay(WalkInStay walkInStay) {
        this.walkInStay = walkInStay;
    }
    
    public ScheduledReservation getScheduledReservation() {
        return scheduledReservation;
    }
    
    public void setScheduledReservation(ScheduledReservation scheduledReservation) {
        this.scheduledReservation = scheduledReservation;
    }
} 