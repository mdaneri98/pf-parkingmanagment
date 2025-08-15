package ar.edu.itba.parkingmanagmentapi.controller;

import ar.edu.itba.parkingmanagmentapi.dto.LoginRequest;
import ar.edu.itba.parkingmanagmentapi.dto.LoginResponse;
import ar.edu.itba.parkingmanagmentapi.dto.RefreshTokenRequest;
import ar.edu.itba.parkingmanagmentapi.dto.RefreshTokenResponse;
import ar.edu.itba.parkingmanagmentapi.dto.RegisterRequest;
import ar.edu.itba.parkingmanagmentapi.dto.RegisterResponse;
import ar.edu.itba.parkingmanagmentapi.dto.ApiResponse;
import ar.edu.itba.parkingmanagmentapi.service.AuthService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        logger.info("Procesando login para usuario: {}", loginRequest.getEmail());

        LoginResponse response = authService.login(loginRequest);

        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(response));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest registerRequest, @RequestParam(value = "manager", defaultValue = "false") boolean isManager) {
        logger.info("Procesando registro para usuario: {} como manager: {}", registerRequest.getEmail(), isManager);

        RegisterResponse response = authService.register(registerRequest, isManager);

        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(response));

    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@Valid @RequestBody RefreshTokenRequest request) {
        logger.info("Procesando refresh");

        RefreshTokenResponse response = authService.refresh(request.getRefreshToken());
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(response));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@Valid @RequestBody RefreshTokenRequest request) {
        logger.info("Procesando logout");
        authService.logout(request.getRefreshToken());
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(null, "Logged out"));
    }

}