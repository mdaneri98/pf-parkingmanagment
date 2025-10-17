package ar.edu.itba.parkingmanagmentapi.repository;

import ar.edu.itba.parkingmanagmentapi.dto.enums.ReservationStatus;
import ar.edu.itba.parkingmanagmentapi.model.WalkInStay;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class WalkInStaySpecifications {

    public static Specification<WalkInStay> withFilters(
            Long userId,
            Long parkingLotId,
            ReservationStatus status,
            String vehiclePlate,
            LocalDateTime from,
            LocalDateTime to
    ) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // filtrar por usuario
            if (userId != null) {
                predicates.add(cb.equal(
                        root.get("userVehicleAssignment").get("user").get("id"),
                        userId
                ));
            }

            // filtrar por parking lot
            if (parkingLotId != null) {
                predicates.add(cb.equal(
                        root.get("spot").get("parkingLot").get("id"),
                        parkingLotId
                ));
            }

            // filtrar por estado
            if (status != null) {
                predicates.add(cb.equal(root.get("status"), status));
            }

            // filtrar por patente del vehículo
            if (vehiclePlate != null && !vehiclePlate.isBlank()) {
                predicates.add(cb.like(
                        cb.lower(root.get("userVehicleAssignment").get("vehicle").get("licensePlate")),
                        "%" + vehiclePlate.toLowerCase() + "%"
                ));
            }

            // rango de tiempo: checkIn >= from, checkOut <= to
            if (from != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("checkInTime"), from));
            }
            if (to != null) {
                // en walk-in puede que el checkOut sea null si la estadía está activa
                predicates.add(cb.lessThanOrEqualTo(root.get("checkOutTime"), to));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}

