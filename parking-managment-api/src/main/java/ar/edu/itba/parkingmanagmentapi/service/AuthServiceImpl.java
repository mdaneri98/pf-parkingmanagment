package ar.edu.itba.parkingmanagmentapi.service;

import ar.edu.itba.parkingmanagmentapi.dto.LoginRequest;
import ar.edu.itba.parkingmanagmentapi.dto.LoginResponse;
import ar.edu.itba.parkingmanagmentapi.dto.RegisterRequest;
import ar.edu.itba.parkingmanagmentapi.dto.RegisterResponse;
import ar.edu.itba.parkingmanagmentapi.exceptions.AlreadyExistsException;
import ar.edu.itba.parkingmanagmentapi.model.User;
import ar.edu.itba.parkingmanagmentapi.repository.UserRepository;
import ar.edu.itba.parkingmanagmentapi.security.provider.EmailBasedAuthenticationProvider;
import ar.edu.itba.parkingmanagmentapi.util.JwtUtil;
import ar.edu.itba.parkingmanagmentapi.validators.LoginRequestValidator;
import ar.edu.itba.parkingmanagmentapi.validators.RegisterRequestValidator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AuthServiceImpl implements AuthService {
    private static final Logger logger = LoggerFactory.getLogger(AuthServiceImpl.class);

    private final JwtUtil jwtUtil;
    private final EmailBasedAuthenticationProvider emailAuthProvider;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RegisterRequestValidator registerRequestValidator;
    private final LoginRequestValidator loginRequestValidator;

    public AuthServiceImpl(JwtUtil jwtUtil,
                           EmailBasedAuthenticationProvider emailAuthProvider,
                           UserRepository userRepository,
                           PasswordEncoder passwordEncoder,
                           RegisterRequestValidator registerRequestValidator,
                           LoginRequestValidator loginRequestValidator) {
        this.jwtUtil = jwtUtil;
        this.emailAuthProvider = emailAuthProvider;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.registerRequestValidator = registerRequestValidator;
        this.loginRequestValidator = loginRequestValidator;
    }

    /**
     * Authenticates a user and generates a JWT token with all user roles
     */
    public LoginResponse login(LoginRequest loginRequest) {
        logger.info("Intento de login para usuario: {}", loginRequest.getEmail());

        try {
            // Verify credentials using the email-based authentication provider
            loginRequestValidator.validate(loginRequest);
            Authentication authentication = emailAuthProvider.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
            );

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();

            // Extract all user roles/authorities
            List<String> roles = userDetails.getAuthorities().stream()
                    .map(Object::toString)
                    .collect(Collectors.toList());

            logger.debug("User {} has roles: {}", loginRequest.getEmail(), roles);

            // Generate JWT token with all roles
            String token = jwtUtil.generateTokenWithRoles(loginRequest.getEmail(), roles);

            logger.info("Login exitoso para usuario: {} con roles: {}", loginRequest.getEmail(), roles);

            return LoginResponse.builder()
                    .token(token)
                    .email(loginRequest.getEmail())
                    .build();

        } catch (BadCredentialsException e) {
            logger.warn("Invalid credentials for user: {}", loginRequest.getEmail());
            throw new BadCredentialsException("Invalid credentials");
        } catch (Exception e) {
            logger.error("Authentication error for user: {}", loginRequest.getEmail(), e);
            throw new RuntimeException("Error during authentication");
        }
    }

    /**
     * Registers a new user
     */
    public RegisterResponse register(RegisterRequest registerRequest) {
        logger.info("Intento de registro para usuario: {}", registerRequest.getEmail());

        registerRequestValidator.validate(registerRequest);

        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            logger.warn("Intento de registro con email ya existente: {}", registerRequest.getEmail());
            throw new AlreadyExistsException("Email already registered");
        }

        // Create new user
        User user = new User();
        user.setFirstName(registerRequest.getFirstName());
        user.setLastName(registerRequest.getLastName());
        user.setEmail(registerRequest.getEmail());
        user.setPasswordHash(passwordEncoder.encode(registerRequest.getPassword()));

        // Save user
        User savedUser = userRepository.save(user);

        logger.info("Usuario registrado exitosamente: {}", registerRequest.getEmail());

        return new RegisterResponse(savedUser.getEmail());
    }
}