package ar.edu.itba.parkingmanagmentapi.repository;

import ar.edu.itba.parkingmanagmentapi.model.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findById(Long id);

    /**
     * Busca un usuario por su email
     */
    Optional<User> findByEmail(String email);

    /**
     * Verifica si existe un usuario con el email especificado
     */
    boolean existsByEmail(String email);

    /**
     * Busca usuarios por nombre o apellido (búsqueda parcial)
     */
    @Query("SELECT u FROM User u WHERE LOWER(u.firstName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
            "OR LOWER(u.lastName) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<User> findByFirstNameOrLastNameContainingIgnoreCase(@Param("searchTerm") String searchTerm);

}