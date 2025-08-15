package ar.edu.itba.parkingmanagmentapi.service;

import ar.edu.itba.parkingmanagmentapi.exceptions.BadRequestException;
import ar.edu.itba.parkingmanagmentapi.exceptions.NotFoundException;
import ar.edu.itba.parkingmanagmentapi.model.RefreshToken;
import ar.edu.itba.parkingmanagmentapi.model.User;
import ar.edu.itba.parkingmanagmentapi.repository.RefreshTokenRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class RefreshTokenServiceImpl implements RefreshTokenService {
    private static final Logger logger = LoggerFactory.getLogger(RefreshTokenServiceImpl.class);

    private final RefreshTokenRepository refreshTokenRepository;

    @Value("${jwt.refresh.expiration}")
    private long refreshTokenTtlMillis;

    public RefreshTokenServiceImpl(RefreshTokenRepository refreshTokenRepository) {
        this.refreshTokenRepository = refreshTokenRepository;
    }

    @Override
    @Transactional
    public RefreshToken createRefreshToken(User user, boolean rotatePrevious) {
        logger.debug("Creating refresh token for user: {} with rotatePrevious: {}", user.getEmail(), rotatePrevious);

        if (rotatePrevious) {
            revokeAllForUser(user);
        }

        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUser(user);
        refreshToken.setToken(UUID.randomUUID().toString());
        refreshToken.setExpiresAt(LocalDateTime.now().plusSeconds(refreshTokenTtlMillis / 1000));
        refreshToken.setRevoked(false);
        return refreshTokenRepository.save(refreshToken);
    }

    @Override
    @Transactional
    public RefreshToken validateAndRotate(String presentedToken) {
        logger.debug("Validating and rotating refresh token: {}", presentedToken);

        RefreshToken token = refreshTokenRepository.findByToken(presentedToken)
                .orElseThrow(() -> new NotFoundException("Refresh token not found"));

        if (token.isRevoked() || token.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Refresh token is invalid or expired");
        }

        token.setRevoked(true);
        RefreshToken newToken = new RefreshToken();
        newToken.setUser(token.getUser());
        newToken.setToken(UUID.randomUUID().toString());
        newToken.setExpiresAt(LocalDateTime.now().plusSeconds(refreshTokenTtlMillis / 1000));
        newToken.setRevoked(false);

        token.setReplacedByToken(newToken.getToken());
        refreshTokenRepository.save(token);
        return refreshTokenRepository.save(newToken);
    }

    @Override   
    @Transactional
    public void revokeAllForUser(User user) {
        logger.debug("Revoking all refresh tokens for user: {}", user.getEmail());

        refreshTokenRepository.deleteByUser(user);
    }

    @Override
    @Transactional
    public void revokeByToken(String presentedToken) {
        refreshTokenRepository.findByToken(presentedToken).ifPresent(token -> {
            token.setRevoked(true);
            refreshTokenRepository.save(token);
        });
    }
}


