    package ar.edu.itba.parkingmanagmentapi.controller;

    import ar.edu.itba.parkingmanagmentapi.dto.LoginRequest;
    import ar.edu.itba.parkingmanagmentapi.dto.LoginResponse;
    import ar.edu.itba.parkingmanagmentapi.dto.RegisterRequest;
    import ar.edu.itba.parkingmanagmentapi.dto.RegisterResponse;
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
                logger.info("Procesando login para usuario: {}", loginRequest.getEmail());

                LoginResponse response = authService.login(loginRequest);

                return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(response));

            } catch (BadCredentialsException e) {
                logger.warn("Intento de login fallido para usuario: {}", loginRequest.getEmail());
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(ApiResponse.error(e.getMessage()));
            } catch (Exception e) {
                logger.error("Error durante el login para usuario: {}", loginRequest.getEmail(), e);
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(ApiResponse.error(e.getMessage()));
            }
        }

        @PostMapping("/register")
        public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest registerRequest,
                                        @RequestParam(value = "manager", defaultValue = "false") boolean isManager) {
            try {
                logger.info("Procesando registro para usuario: {} como manager: {}", registerRequest.getEmail(), isManager);

                RegisterResponse response = authService.register(registerRequest, isManager);

                return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(response));

            } catch (IllegalArgumentException e) {
                logger.warn("Error de validación durante el registro: {}", e.getMessage());
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponse.error(e.getMessage()));
            } catch (Exception e) {
                logger.error("Error durante el registro para usuario: {}", registerRequest.getEmail(), e);
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(ApiResponse.error(e.getMessage()));
            }
        }

    }