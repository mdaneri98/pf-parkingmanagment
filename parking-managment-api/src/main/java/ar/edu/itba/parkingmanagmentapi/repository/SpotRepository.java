package ar.edu.itba.parkingmanagmentapi.repository;

import ar.edu.itba.parkingmanagmentapi.model.ParkingLot;
import ar.edu.itba.parkingmanagmentapi.model.Spot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface SpotRepository extends JpaRepository<Spot, Long>, JpaSpecificationExecutor<Spot> {
    boolean existsByParkingLotAndFloorAndCode(ParkingLot parkingLot, int floor, String code);

    boolean existsByParkingLotAndFloorAndCodeAndIdNot(
            ParkingLot parkingLot,
            Integer floor,
            String code,
            Long id
    );
}
