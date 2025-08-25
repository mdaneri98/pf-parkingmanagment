package ar.edu.itba.parkingmanagmentapi.repository;

import ar.edu.itba.parkingmanagmentapi.model.ParkingPrice;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class ParkingPriceSpecifications {

    public static Specification<ParkingPrice> withFilters(
            Long parkingLotId,
            BigDecimal min,
            BigDecimal max,
            String vehicleType,
            LocalDateTime from,
            LocalDateTime to
    ) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            predicates.add(cb.equal(root.get("parkingLot").get("id"), parkingLotId));

            // rango de precios
            if (min != null && max != null) {
                predicates.add(cb.between(root.get("price"), min, max));
            } else if (min != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("price"), min));
            } else if (max != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("price"), max));
            }

            // tipo de vehículo
            if (vehicleType != null && !vehicleType.isBlank()) {
                predicates.add(cb.equal(root.get("vehicleType"), vehicleType));
            }

            // rango de tiempo válido
            if (from != null && to != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("validFrom"), to));
                predicates.add(cb.or(
                        cb.isNull(root.get("validTo")),
                        cb.greaterThanOrEqualTo(root.get("validTo"), from)
                ));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
