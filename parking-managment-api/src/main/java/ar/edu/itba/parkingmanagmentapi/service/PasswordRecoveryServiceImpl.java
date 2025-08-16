package ar.edu.itba.parkingmanagmentapi.service;

import ar.edu.itba.parkingmanagmentapi.dto.PasswordRecoveryRequest;
import ar.edu.itba.parkingmanagmentapi.dto.PasswordRecoveryResponse;
import ar.edu.itba.parkingmanagmentapi.dto.ResetPasswordRequest;
import ar.edu.itba.parkingmanagmentapi.dto.VerifyRecoveryTokenRequest;
import ar.edu.itba.parkingmanagmentapi.exceptions.BadRequestException;
import ar.edu.itba.parkingmanagmentapi.exceptions.NotFoundException;
import ar.edu.itba.parkingmanagmentapi.model.User;
import ar.edu.itba.parkingmanagmentapi.repository.UserRepository;
import ar.edu.itba.parkingmanagmentapi.util.CodeType;
import ar.edu.itba.parkingmanagmentapi.validators.PasswordRecoveryRequestValidator;
import ar.edu.itba.parkingmanagmentapi.validators.ResetPasswordRequestValidator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.Duration;
import java.util.Optional;
import java.util.UUID;

@Service
public class PasswordRecoveryServiceImpl implements PasswordRecoveryService {
    private static final Logger logger = LoggerFactory.getLogger(PasswordRecoveryServiceImpl.class);

    private final StringRedisTemplate stringRedisTemplate;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RefreshTokenService refreshTokenService;
    private final PasswordRecoveryRequestValidator passwordRecoveryRequestValidator;
    private final ResetPasswordRequestValidator resetPasswordRequestValidator;

    @Value("${recovery.token.ttl-seconds}")
    private long recoveryTtlSeconds;

    @Value("${recovery.expose-token-in-response}")
    private boolean exposeTokenInResponse;

    public PasswordRecoveryServiceImpl(StringRedisTemplate stringRedisTemplate,
                                       UserRepository userRepository,
                                       PasswordEncoder passwordEncoder,
                                       RefreshTokenService refreshTokenService,
                                       PasswordRecoveryRequestValidator passwordRecoveryRequestValidator,
                                       ResetPasswordRequestValidator resetPasswordRequestValidator) {
        this.stringRedisTemplate = stringRedisTemplate;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.refreshTokenService = refreshTokenService;
        this.passwordRecoveryRequestValidator = passwordRecoveryRequestValidator;
        this.resetPasswordRequestValidator = resetPasswordRequestValidator;
    }

    private String tokenKey(String token) {
        return "pwrec:token:" + token;
    }

    @Override
    public PasswordRecoveryResponse requestRecovery(PasswordRecoveryRequest request) {
        passwordRecoveryRequestValidator.validate(request);

        String email = request.getEmail();

        if (!StringUtils.hasText(email)) {
            return null;
        }

        if (!userRepository.existsByEmail(email)) {
            throw new NotFoundException("The email doesn't exists");
        }

        String token = CodeType.EMAIL_RECOVERY.generate();
        String tokenKey = tokenKey(token);

        // Store token->email
        stringRedisTemplate.opsForValue().set(tokenKey, email, Duration.ofSeconds(recoveryTtlSeconds));

        logger.info("Password recovery requested for email: {}", email);

        return PasswordRecoveryResponse.builder().token(exposeTokenInResponse ? token : null).build();
    }

    @Override
    public boolean verifyToken(VerifyRecoveryTokenRequest request) {
        String token = request.getToken();

        if (CodeType.EMAIL_RECOVERY.isValid(token)) {
            return false;
        }
        String value = stringRedisTemplate.opsForValue().get(tokenKey(token));
        return StringUtils.hasText(value);
    }

    @Override
    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        resetPasswordRequestValidator.validate(request);

        String token = request.getToken();
        String rawNewPassword = request.getNewPassword();

        if (CodeType.EMAIL_RECOVERY.isValid(token)) {
            throw new BadRequestException("Invalid or expired token");
        }
        String email = stringRedisTemplate.opsForValue().get(tokenKey(token));
        if (!StringUtils.hasText(email)) {
            throw new BadRequestException("Invalid or expired token");
        }

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            deleteRecoveryToken(token);
            throw new BadRequestException("Invalid or expired token");
        }

        User user = userOpt.get();
        user.setPasswordHash(passwordEncoder.encode(rawNewPassword));
        userRepository.save(user);

        refreshTokenService.revokeAllForUser(user);

        deleteRecoveryToken(token);

        logger.info("Password reset successfully for user: {}", email);
    }

    private void deleteRecoveryToken(String token) {
        try {
            stringRedisTemplate.delete(tokenKey(token));
        } catch (Exception e) {
            logger.warn("Failed to cleanup recovery token {}: {}", token, e.getMessage());
        }
    }
}


