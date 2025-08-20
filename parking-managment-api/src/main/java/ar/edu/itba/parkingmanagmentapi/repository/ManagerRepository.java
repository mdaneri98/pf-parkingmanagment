package ar.edu.itba.parkingmanagmentapi.repository;

import ar.edu.itba.parkingmanagmentapi.model.Manager;
import ar.edu.itba.parkingmanagmentapi.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ManagerRepository extends JpaRepository<Manager, Long> {

    /**
     * Busca un manager por su user_id
     */
    Optional<Manager> findByUserId(Long userId);

    /**
     * Verifica si existe un manager con el user_id especificado
     */
    boolean existsByUserId(Long userId);

    Optional<Manager> findByUser(User user);

}