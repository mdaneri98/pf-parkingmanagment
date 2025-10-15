package ar.edu.itba.parkingmanagmentapi.service;

import ar.edu.itba.parkingmanagmentapi.exceptions.NotFoundException;
import ar.edu.itba.parkingmanagmentapi.model.ParkingPrice;
import ar.edu.itba.parkingmanagmentapi.model.Spot;
import ar.edu.itba.parkingmanagmentapi.repository.ParkingPriceRepository;
import ar.edu.itba.parkingmanagmentapi.repository.ScheduledReservationRepository;
import ar.edu.itba.parkingmanagmentapi.repository.WalkInStayRepository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public abstract class ReservationServiceImpl<T> implements ReservationService<T> {

    protected final SpotService spotService;
    protected final ParkingPriceRepository parkingPriceRepository;
    protected final VehicleService vehicleService;
    protected final WalkInStayRepository walkInStayRepository;
    protected final ScheduledReservationRepository reservationRepository;
    protected final UserVehicleAssignmentService userVehicleAssignmentService;

    protected ReservationServiceImpl(
            SpotService spotService,
            ParkingPriceRepository parkingPriceRepository,
            VehicleService vehicleService,
            WalkInStayRepository walkInStayRepository,
            ScheduledReservationRepository reservationRepository,
            UserVehicleAssignmentService userVehicleAssignmentService
    ) {
        this.vehicleService = vehicleService;
        this.spotService = spotService;
        this.parkingPriceRepository = parkingPriceRepository;
        this.walkInStayRepository = walkInStayRepository;
        this.reservationRepository = reservationRepository;
        this.userVehicleAssignmentService = userVehicleAssignmentService;
    }

    protected boolean existActivePrice(Long parkingLotId, String vehicleType) {
        List<ParkingPrice> prices = parkingPriceRepository.findByParkingLotIdAndVehicleType(parkingLotId, vehicleType);
        return !prices.isEmpty();
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

    protected Spot findSpotAndChangeAvailability(Long spotId, boolean makeAvailable) {
        Spot spot = spotService.findEntityById(spotId);

        if (!makeAvailable && !spot.getIsAvailable()) {
            throw new NotFoundException("The spot with id " + spot.getId() + " is not available");
        }

        spot.setIsAvailable(makeAvailable);
        return spotService.updateEntityById(spotId, spot);
    }

}
