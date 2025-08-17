package ar.edu.itba.parkingmanagmentapi.repository;

import ar.edu.itba.parkingmanagmentapi.model.Spot;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class SpotSpecifications {
    public static Specification<Spot> withFilters(Long parkingLotId, Boolean available, String vehicleType, Integer floor) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("parkingLot").get("id"), parkingLotId));

            if (available != null) {
                predicates.add(cb.equal(root.get("isAvailable"), available));
            }
            if (vehicleType != null) {
                predicates.add(cb.equal(root.get("vehicleType"), vehicleType));
            }
            if (floor != null) {
                predicates.add(cb.equal(root.get("floor"), floor));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
