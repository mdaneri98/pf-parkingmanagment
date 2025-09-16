package ar.edu.itba.parkingmanagmentapi.repository;

import ar.edu.itba.parkingmanagmentapi.model.ParkingLot;
import ar.edu.itba.parkingmanagmentapi.model.ParkingPrice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ParkingPriceRepository extends JpaRepository<ParkingPrice, Long>, JpaSpecificationExecutor<ParkingPrice> {

    List<ParkingPrice> findByParkingLotId(Long parkingLotId);

    List<ParkingPrice> findByParkingLotIdAndPriceBetween(Long parkingLotId, BigDecimal min, BigDecimal max);

    List<ParkingPrice> findByParkingLotAndVehicleType(ParkingLot parkingLot, String vehicleType);

    List<ParkingPrice> findByParkingLotIdAndVehicleType(Long parkingLot, String vehicleType);


}
