package ar.edu.itba.parkingmanagmentapi.service;

import ar.edu.itba.parkingmanagmentapi.exceptions.NotFoundException;
import ar.edu.itba.parkingmanagmentapi.model.ParkingPrice;
import ar.edu.itba.parkingmanagmentapi.model.Spot;
import ar.edu.itba.parkingmanagmentapi.model.UserVehicleAssignment;
import ar.edu.itba.parkingmanagmentapi.repository.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public abstract class ReservationServiceImpl<T> implements ReservationService<T> {

    protected final SpotRepository spotRepository;
    private final ParkingPriceRepository parkingPriceRepository;
    private final UserVehicleAssignmentRepository userVehicleAssignmentRepository;
    protected final WalkInStayRepository walkInStayRepository;
    protected final ScheduledReservationRepository reservationRepository;

    protected ReservationServiceImpl(SpotRepository spotRepository, ParkingPriceRepository parkingPriceRepository, UserVehicleAssignmentRepository userVehicleAssignmentRepository, WalkInStayRepository walkInStayRepository, ScheduledReservationRepository reservationRepository) {
        this.userVehicleAssignmentRepository = userVehicleAssignmentRepository;
        this.spotRepository = spotRepository;
        this.parkingPriceRepository = parkingPriceRepository;
        this.walkInStayRepository = walkInStayRepository;
        this.reservationRepository = reservationRepository;
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

    protected UserVehicleAssignment verifyUserVehicleAssignment(Long userId, String licensePlate) {
        // buscar relación User-Vehicle
        return userVehicleAssignmentRepository
                .findByUserIdAndVehicleLicensePlate(userId, licensePlate)
                .orElseThrow(() -> new NotFoundException(
                        "There is no vehicle assignment with license plate " + licensePlate +
                                " for the user with id " + userId
                ));
    }

    protected UserVehicleAssignment getUserVehicleAssignmentByVehicleLicensePlate(String licensePlate) {
        return userVehicleAssignmentRepository
                .findByVehicleLicensePlate(licensePlate)
                .orElseThrow(() -> new NotFoundException(
                        "There is no vehicle assignment with license plate " + licensePlate
                ));
    }
    

    protected Spot getSpotById(Long spotId) {
        return spotRepository.findById(spotId)
                .orElseThrow(() -> new NotFoundException("Spot with id " + spotId + " not found"));
    }
}
