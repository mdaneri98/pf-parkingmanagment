package ar.edu.itba.parkingmanagmentapi.repository;

import ar.edu.itba.parkingmanagmentapi.model.UserVehicleAssignment;
import ar.edu.itba.parkingmanagmentapi.model.UserVehicleAssignmentId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserVehicleAssignmentRepository extends JpaRepository<UserVehicleAssignment, UserVehicleAssignmentId> {
}
