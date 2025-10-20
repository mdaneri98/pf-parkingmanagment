package ar.edu.itba.parkingmanagmentapi.service;

import ar.edu.itba.parkingmanagmentapi.config.AppConstants;
import ar.edu.itba.parkingmanagmentapi.exceptions.NotFoundException;
import ar.edu.itba.parkingmanagmentapi.model.ParkingPrice;
import ar.edu.itba.parkingmanagmentapi.model.Spot;
import ar.edu.itba.parkingmanagmentapi.model.UserVehicleAssignment;
import ar.edu.itba.parkingmanagmentapi.model.Vehicle;
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
            throw new NotFoundException("price.not.found");
        }

        ParkingPrice price = prices.get(0);
        long hours = java.time.Duration.between(start, end).toHours();
        if (hours == 0) hours = AppConstants.MINIMUM_BILLING_HOURS;

        return price.getPrice().multiply(BigDecimal.valueOf(hours));
    }

    protected Spot findSpotAndChangeAvailability(Long spotId, boolean makeAvailable) {
        Spot spot = spotService.findEntityById(spotId);

        if (!makeAvailable && !spot.getIsAvailable()) {
            throw new NotFoundException("spot.not.available", spot.getId());
        }

        spot.setIsAvailable(makeAvailable);
        return spotService.updateEntity(spot);
    }

    protected UserVehicleAssignment findOrCreateVehicleAssignment(String licensePlate, String vehicleType) {
        Vehicle vehicle = vehicleService.findEntityByLicensePlateOrCreate(
                new Vehicle(licensePlate, null, null, vehicleType)
        );
        return userVehicleAssignmentService.findByUserIdAndLicensePlateOrCreate(
                AppConstants.DEFAULT_USER_ID, vehicle.getLicensePlate()
        );
    }

}
