package ar.edu.itba.parkingmanagmentapi.repository;

import ar.edu.itba.parkingmanagmentapi.model.UserVehicleAssignment;
import ar.edu.itba.parkingmanagmentapi.model.UserVehicleAssignmentId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserVehicleAssignmentRepository extends JpaRepository<UserVehicleAssignment, UserVehicleAssignmentId> {

    @Query("SELECT uva FROM UserVehicleAssignment uva " +
            "WHERE uva.user.id = :userId AND uva.vehicle.licensePlate = :licensePlate")
    Optional<UserVehicleAssignment> findByUserIdAndVehicleLicensePlate(
            @Param("userId") Long userId,
            @Param("licensePlate") String licensePlate
    );

    Optional<UserVehicleAssignment> findByVehicleLicensePlate(String licensePlate);
}
