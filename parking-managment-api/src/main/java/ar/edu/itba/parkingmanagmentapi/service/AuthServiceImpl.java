package ar.edu.itba.parkingmanagmentapi.service;

import ar.edu.itba.parkingmanagmentapi.dto.LoginRequest;
import ar.edu.itba.parkingmanagmentapi.dto.LoginResponse;
import ar.edu.itba.parkingmanagmentapi.util.JwtUtil;
import ar.edu.itba.parkingmanagmentapi.validators.LoginRequestValidator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {
    private static final Logger logger = LoggerFactory.getLogger(AuthServiceImpl.class);
    private final LoginRequestValidator loginRequestValidator;
    private final UserService userService;
    private final JwtUtil jwtUtil;

    public AuthServiceImpl(LoginRequestValidator loginRequestValidator, UserService userService, JwtUtil jwtUtil) {
        this.loginRequestValidator = loginRequestValidator;
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    /**
     * Autentica un usuario y genera un token JWT
     */
    public LoginResponse login(LoginRequest loginRequest) {
        loginRequestValidator.validate(loginRequest);
        logger.info("Intento de login para usuario: {}", loginRequest.getEmail());

        // Verificar credenciales
        boolean isValid = userService.verifyCredentials(loginRequest.getEmail(), loginRequest.getPassword());

        if (!isValid) {
            logger.warn("Credenciales inválidas para usuario: {}", loginRequest.getEmail());
            throw new BadCredentialsException("Credenciales inválidas");
        }

        // Generar token JWT
        String token = jwtUtil.generateToken(loginRequest.getEmail());

        logger.info("Login exitoso para usuario: {}", loginRequest.getEmail());

        return new LoginResponse(token, loginRequest.getEmail(), "Login exitoso");
    }
}