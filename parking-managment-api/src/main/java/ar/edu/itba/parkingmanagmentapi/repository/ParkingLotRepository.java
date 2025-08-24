package ar.edu.itba.parkingmanagmentapi.repository;

import ar.edu.itba.parkingmanagmentapi.model.ParkingLot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ParkingLotRepository extends JpaRepository<ParkingLot, Long> {

    boolean existsByAddress(String address);

    /**
     * Find all parking lots owned by a specific user ID
     */
    @Query("SELECT pl FROM ParkingLot pl JOIN pl.manager m WHERE m.user.id = :userId")
    List<ParkingLot> findByManagerUserId(@Param("userId") Long userId);
}
