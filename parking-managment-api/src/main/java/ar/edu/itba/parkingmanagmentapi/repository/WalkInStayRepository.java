package ar.edu.itba.parkingmanagmentapi.repository;

import ar.edu.itba.parkingmanagmentapi.model.Spot;
import ar.edu.itba.parkingmanagmentapi.model.User;
import ar.edu.itba.parkingmanagmentapi.model.WalkInStay;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface WalkInStayRepository extends JpaRepository<WalkInStay, Long>, JpaSpecificationExecutor<WalkInStay> {

    @Query("""
            SELECT r.spot.parkingLot.manager.user
            FROM WalkInStay r
            WHERE r.id = :reservationId
            """)
    Optional<User> findManagerByReservationId(@Param("reservationId") Long reservationId);

    @Query("""
            SELECT w FROM WalkInStay w
            JOIN FETCH w.spot
            JOIN FETCH w.userVehicleAssignment uva
            JOIN FETCH uva.user
            JOIN FETCH uva.vehicle
            WHERE w.expectedEndTime <= :limitTime
            """)
    List<WalkInStay> findExpiringSoon(@Param("limitTime") LocalDateTime limitTime);

    @Query("SELECT r.userVehicleAssignment.user FROM ScheduledReservation r WHERE r.id = :reservationId")
    Optional<User> findOwnerByReservationId(@Param("reservationId") Long reservationId);

    boolean existsBySpotAndCheckOutTimeIsNull(Spot spot);

    @Modifying
    @Query("""
                UPDATE ScheduledReservation r
                SET r.spotCodeSnapshot = :code,
                    r.spotFloorSnapshot = :floor
                WHERE r.spot.id = :spotId
            """)
    void updateSpotSnapshot(Long spotId, String code, Integer floor);


}

