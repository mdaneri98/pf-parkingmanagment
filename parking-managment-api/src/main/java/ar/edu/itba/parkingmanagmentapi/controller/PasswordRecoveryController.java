package ar.edu.itba.parkingmanagmentapi.controller;

import ar.edu.itba.parkingmanagmentapi.dto.*;
import ar.edu.itba.parkingmanagmentapi.service.PasswordRecoveryService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth/password-recovery")
public class PasswordRecoveryController {

    private final PasswordRecoveryService passwordRecoveryService;

    public PasswordRecoveryController(PasswordRecoveryService passwordRecoveryService) {
        this.passwordRecoveryService = passwordRecoveryService;
    }

    @PostMapping("/request")
    public ResponseEntity<?> requestRecovery(@Valid @RequestBody PasswordRecoveryRequest request) {
        return ApiResponse.ok(passwordRecoveryService.requestRecovery(request));
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyToken(@Valid @RequestBody VerifyRecoveryTokenRequest request) {
        return ApiResponse.ok(VerifyRecoveryTokenResponse.builder().valid(passwordRecoveryService.verifyToken(request)).build());
    }

    @PostMapping("/reset")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        passwordRecoveryService.resetPassword(request);
        return ApiResponse.ok(ResetPasswordResponse.builder().done(true).build());
    }
}


