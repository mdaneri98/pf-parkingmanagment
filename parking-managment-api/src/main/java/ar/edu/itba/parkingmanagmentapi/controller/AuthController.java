    package ar.edu.itba.parkingmanagmentapi.controller;

    import ar.edu.itba.parkingmanagmentapi.dto.LoginRequest;
    import ar.edu.itba.parkingmanagmentapi.dto.LoginResponse;
    import ar.edu.itba.parkingmanagmentapi.dto.ApiResponse;
    import ar.edu.itba.parkingmanagmentapi.service.AuthService;
    import jakarta.validation.Valid;
    import org.slf4j.Logger;
    import org.slf4j.LoggerFactory;
    import org.springframework.http.HttpStatus;
    import org.springframework.http.ResponseEntity;
    import org.springframework.security.authentication.BadCredentialsException;
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
            try {
                logger.info("Procesando login para usuario: {}", loginRequest.getUsername());

                LoginResponse response = authService.login(loginRequest);

                return ResponseEntity.ok(response);

            } catch (BadCredentialsException e) {
                ApiResponse.success(HttpStatus.UNAUTHORIZED, e.getMessage());
                logger.warn("Intento de login fallido para usuario: {}", loginRequest.getUsername());
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(ApiResponse.error(e.getMessage()));
            } catch (Exception e) {
                logger.error("Error durante el login para usuario: {}", loginRequest.getUsername(), e);
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(ApiResponse.error(e.getMessage()));
            }
        }



    }