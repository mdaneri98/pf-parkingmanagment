package ar.edu.itba.parkingmanagmentapi.service;

import ar.edu.itba.parkingmanagmentapi.dto.LoginRequest;
import ar.edu.itba.parkingmanagmentapi.dto.LoginResponse;
import ar.edu.itba.parkingmanagmentapi.util.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl {
    private static final Logger logger = LoggerFactory.getLogger(AuthServiceImpl.class);

    private final UserService userService;
    private final JwtUtil jwtUtil;

    public AuthServiceImpl(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    /**
     * Autentica un usuario y genera un token JWT
     */
    public LoginResponse login(LoginRequest loginRequest) {
        logger.info("Intento de login para usuario: {}", loginRequest.getUsername());

        // Verificar credenciales
        boolean isValid = userService.verifyCredentials(loginRequest.getUsername(), loginRequest.getPassword());

        if (!isValid) {
            logger.warn("Credenciales inválidas para usuario: {}", loginRequest.getUsername());
            throw new BadCredentialsException("Credenciales inválidas");
        }

        // Generar token JWT
        String token = jwtUtil.generateToken(loginRequest.getUsername());

        logger.info("Login exitoso para usuario: {}", loginRequest.getUsername());

        return new LoginResponse(token, loginRequest.getUsername(), "Login exitoso");
    }
}