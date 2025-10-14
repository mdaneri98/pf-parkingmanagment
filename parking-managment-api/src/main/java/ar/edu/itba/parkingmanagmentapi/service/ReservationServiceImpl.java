package ar.edu.itba.parkingmanagmentapi.service;

import ar.edu.itba.parkingmanagmentapi.exceptions.NotFoundException;
import ar.edu.itba.parkingmanagmentapi.model.ParkingPrice;
import ar.edu.itba.parkingmanagmentapi.model.Spot;
import ar.edu.itba.parkingmanagmentapi.repository.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public abstract class ReservationServiceImpl<T> implements ReservationService<T> {

    protected final SpotRepository spotRepository;
    protected final ParkingPriceRepository parkingPriceRepository;
    protected final UserRepository userRepository;
    protected final VehicleService vehicleService;
    protected final WalkInStayRepository walkInStayRepository;
    protected final ScheduledReservationRepository reservationRepository;
    protected final UserVehicleAssignmentService userVehicleAssignmentService;

    protected ReservationServiceImpl(
            SpotRepository spotRepository,
            ParkingPriceRepository parkingPriceRepository,
            UserRepository userRepository,
            VehicleService vehicleService,
            WalkInStayRepository walkInStayRepository,
            ScheduledReservationRepository reservationRepository,
            UserVehicleAssignmentService userVehicleAssignmentService
    ) {
        this.userRepository = userRepository;
        this.vehicleService = vehicleService;
        this.spotRepository = spotRepository;
        this.parkingPriceRepository = parkingPriceRepository;
        this.walkInStayRepository = walkInStayRepository;
        this.reservationRepository = reservationRepository;
        this.userVehicleAssignmentService = userVehicleAssignmentService;
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

}
