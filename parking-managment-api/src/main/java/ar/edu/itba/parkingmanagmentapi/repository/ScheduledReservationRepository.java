package ar.edu.itba.parkingmanagmentapi.repository;

import ar.edu.itba.parkingmanagmentapi.dto.enums.ReservationStatus;
import ar.edu.itba.parkingmanagmentapi.model.ScheduledReservation;
import ar.edu.itba.parkingmanagmentapi.model.Spot;
import ar.edu.itba.parkingmanagmentapi.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ScheduledReservationRepository extends JpaRepository<ScheduledReservation, Long>, JpaSpecificationExecutor<ScheduledReservation> {

    // Buscar reservas de un spot en un rango de tiempo
    List<ScheduledReservation> findBySpotAndReservedStartTimeLessThanEqualAndExpectedEndTimeGreaterThanEqual(
            Spot spot,
            LocalDateTime start,
            LocalDateTime end
    );

    @Query("SELECT r.userVehicleAssignment.user FROM ScheduledReservation r WHERE r.id = :reservationId")
    Optional<User> findOwnerByReservationId(@Param("reservationId") Long reservationId);

    @Query("""
            SELECT r.spot.parkingLot.manager.user
            FROM ScheduledReservation r
            WHERE r.id = :reservationId
            """)
    Optional<User> findManagerByReservationId(@Param("reservationId") Long reservationId);

    List<ScheduledReservation> findByStatusAndReservedStartTimeLessThanEqual(ReservationStatus status, LocalDateTime now);

    @Modifying
    @Query("""
                UPDATE ScheduledReservation r
                SET r.spotCodeSnapshot = :code,
                    r.spotFloorSnapshot = :floor
                WHERE r.spot.id = :spotId
            """)
    void updateSpotSnapshot(Long spotId, String code, Integer floor);

    boolean existsBySpotIdAndReservedStartTimeAfter(Long spotId, LocalDateTime time);

    boolean existsBySpotParkingLotIdAndReservedStartTimeAfter(Long parkingLotId, LocalDateTime dateTime);
}
