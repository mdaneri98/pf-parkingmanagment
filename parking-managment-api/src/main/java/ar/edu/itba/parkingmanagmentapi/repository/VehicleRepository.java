package ar.edu.itba.parkingmanagmentapi.repository;

import ar.edu.itba.parkingmanagmentapi.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, String> {
    boolean existsByLicensePlate(String licensePlate);

    @Query("SELECT v FROM Vehicle v JOIN v.userAssignments ua WHERE ua.user.id = :userId")
    List<Vehicle> findByUserId(@Param("userId") Long userId);

    Optional<Vehicle> findByLicensePlate(String licensePlate);

    @Query("SELECT v FROM Vehicle v " +
            "JOIN v.userAssignments uva " +
            "JOIN uva.user u " +
            "WHERE u.id = :userId")
    List<Vehicle> findAllByUserId(@Param("userId") Long userId);
}
