package ar.edu.itba.parkingmanagmentapi.model;

import ar.edu.itba.parkingmanagmentapi.dto.enums.ReservationStatus;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "scheduled_reservation")
public class ScheduledReservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "reserved_start_time", nullable = false)
    private LocalDateTime reservedStartTime;

    @Column(name = "expected_end_time", nullable = false)
    private LocalDateTime expectedEndTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReservationStatus status = ReservationStatus.PENDING;

    @Column(name = "estimated_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal estimatedPrice;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "spot_id", foreignKey = @ForeignKey(ConstraintMode.CONSTRAINT))
    @OnDelete(action = OnDeleteAction.SET_NULL)
    private Spot spot;

    @Column(name = "spot_code_snapshot")
    private String spotCodeSnapshot;

    @Column(name = "spot_floor_snapshot")
    private Integer spotFloorSnapshot;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumns({
            @JoinColumn(name = "user_id", referencedColumnName = "user_id", nullable = false),
            @JoinColumn(name = "vehicle_license_plate", referencedColumnName = "vehicle_license_plate", nullable = false)
    })
    private UserVehicleAssignment userVehicleAssignment;

    @OneToMany(mappedBy = "scheduledReservation", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private final List<Incident> incidents = new ArrayList<>();

    // Constructores
    public ScheduledReservation() {
    }

    public ScheduledReservation(LocalDateTime reservedStartTime, LocalDateTime expectedEndTime,
                                BigDecimal estimatedPrice, Spot spot, UserVehicleAssignment userVehicleAssignment) {
        this.reservedStartTime = reservedStartTime;
        this.expectedEndTime = expectedEndTime;
        this.estimatedPrice = estimatedPrice;
        this.spot = spot;
        this.userVehicleAssignment = userVehicleAssignment;
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

    public UserVehicleAssignment getUserVehicleAssignment() {
        return userVehicleAssignment;
    }

    public void setUserVehicleAssignment(UserVehicleAssignment userVehicleAssignment) {
        this.userVehicleAssignment = userVehicleAssignment;
    }

    public Integer getSpotFloorSnapshot() {
        return spotFloorSnapshot;
    }

    public String getSpotCodeSnapshot() {
        return spotCodeSnapshot;
    }
}