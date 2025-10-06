package ar.edu.itba.parkingmanagmentapi.model;

import ar.edu.itba.parkingmanagmentapi.dto.enums.ReservationStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "walk_in_stay")
public class WalkInStay {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "La fecha de entrada es obligatoria")
    @Column(name = "check_in_time", nullable = false)
    private LocalDateTime checkInTime;

    @Column(name = "expected_end_time")
    private LocalDateTime expectedEndTime;

    @Column(name = "check_out_time")
    private LocalDateTime checkOutTime;

    @DecimalMin(value = "0.0", inclusive = false, message = "El precio total debe ser mayor a 0")
    @Column(name = "total_price", precision = 10, scale = 2)
    private BigDecimal totalPrice;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private ReservationStatus status = ReservationStatus.ACTIVE;

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

    @OneToMany(mappedBy = "walkInStay", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private final List<Incident> incidents = new ArrayList<>();

    // Constructores
    public WalkInStay() {
    }

    public WalkInStay(LocalDateTime checkInTime, Spot spot, UserVehicleAssignment userVehicleAssignment) {
        this.checkInTime = checkInTime;
        this.spot = spot;
        this.userVehicleAssignment = userVehicleAssignment;
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getCheckInTime() {
        return checkInTime;
    }

    public void setCheckInTime(LocalDateTime checkInTime) {
        this.checkInTime = checkInTime;
    }

    public LocalDateTime getCheckOutTime() {
        return checkOutTime;
    }

    public void setCheckOutTime(LocalDateTime checkOutTime) {
        this.checkOutTime = checkOutTime;
    }

    public BigDecimal getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(BigDecimal totalPrice) {
        this.totalPrice = totalPrice;
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

    public UserVehicleAssignment getUserVehicleAssignment() {
        return userVehicleAssignment;
    }

    public void setUserVehicleAssignment(UserVehicleAssignment userVehicleAssignment) {
        this.userVehicleAssignment = userVehicleAssignment;
    }

    public Spot getSpot() {
        return spot;
    }

    public void setSpot(Spot spot) {
        this.spot = spot;
    }

    public ReservationStatus getStatus() {
        return status;
    }

    public void setStatus(ReservationStatus status) {
        this.status = status;
    }

    public LocalDateTime getExpectedEndTime() {
        return expectedEndTime;
    }

    public void setExpectedEndTime(LocalDateTime expectedEndTime) {
        this.expectedEndTime = expectedEndTime;
    }

    public String getSpotCodeSnapshot() {
        return spotCodeSnapshot;
    }

    public Integer getSpotFloorSnapshot() {
        return spotFloorSnapshot;
    }

} 