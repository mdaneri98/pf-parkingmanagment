package ar.edu.itba.parkingmanagmentapi.service;

import ar.edu.itba.parkingmanagmentapi.exceptions.NotFoundException;
import ar.edu.itba.parkingmanagmentapi.model.ParkingPrice;
import ar.edu.itba.parkingmanagmentapi.model.Spot;
import ar.edu.itba.parkingmanagmentapi.model.UserVehicleAssignment;
import ar.edu.itba.parkingmanagmentapi.model.WalkInStay;
import ar.edu.itba.parkingmanagmentapi.repository.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public abstract class ReservationServiceImpl<T> implements ReservationService<T> {

    protected final SpotRepository spotRepository;
    protected final ParkingPriceRepository parkingPriceRepository;
    protected final UserRepository userRepository;
    protected final VehicleRepository vehicleRepository;
    protected final WalkInStayRepository walkInStayRepository;
    protected final ScheduledReservationRepository reservationRepository;
    protected final UserVehicleAssignmentRepository userVehicleAssignmentRepository;

    protected ReservationServiceImpl(
            SpotRepository spotRepository,
            ParkingPriceRepository parkingPriceRepository,
            UserRepository userRepository,
            VehicleRepository vehicleRepository,
            WalkInStayRepository walkInStayRepository,
            ScheduledReservationRepository reservationRepository,
            UserVehicleAssignmentRepository userVehicleAssignmentRepository
    ) {
        this.userRepository = userRepository;
        this.vehicleRepository = vehicleRepository;
        this.spotRepository = spotRepository;
        this.parkingPriceRepository = parkingPriceRepository;
        this.walkInStayRepository = walkInStayRepository;
        this.reservationRepository = reservationRepository;
        this.userVehicleAssignmentRepository = userVehicleAssignmentRepository;
    }

    protected BigDecimal calculateEstimatedPrice(Spot spot, LocalDateTime start, LocalDateTime end) {
        List<ParkingPrice> prices = parkingPriceRepository.findByParkingLotIdAndVehicleType(
                spot.getParkingLot().getId(),
                spot.getVehicleType()
        );

        if (prices.isEmpty()) {
            throw new NotFoundException("There are no rates available for this type of vehicle.");
        }

        ParkingPrice price = prices.get(0);
        long hours = java.time.Duration.between(start, end).toHours();
        if (hours == 0) hours = 1;

        return price.getPrice().multiply(BigDecimal.valueOf(hours));
    }

    protected Spot getSpotById(Long spotId) {
        return spotRepository.findById(spotId)
                .orElseThrow(() -> new NotFoundException("Spot with id " + spotId + " not found"));
    }
}
