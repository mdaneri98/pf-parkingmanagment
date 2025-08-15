package ar.edu.itba.parkingmanagmentapi.repository;

import ar.edu.itba.parkingmanagmentapi.model.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Long> {
    boolean existsByUserId(Long userId);
    Optional<Admin> findByUserId(Long userId);
}


