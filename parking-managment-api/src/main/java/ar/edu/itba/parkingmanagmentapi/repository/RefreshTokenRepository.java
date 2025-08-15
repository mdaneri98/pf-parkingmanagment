package ar.edu.itba.parkingmanagmentapi.repository;

import ar.edu.itba.parkingmanagmentapi.model.RefreshToken;
import ar.edu.itba.parkingmanagmentapi.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);
    void deleteByUser(User user);
}


