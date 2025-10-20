package ar.edu.itba.parkingmanagmentapi.controller;

import ar.edu.itba.parkingmanagmentapi.dto.*;
import ar.edu.itba.parkingmanagmentapi.exceptions.AuthenticationFailedException;
import ar.edu.itba.parkingmanagmentapi.security.service.SecurityService;
import ar.edu.itba.parkingmanagmentapi.service.UserService;
import ar.edu.itba.parkingmanagmentapi.service.VehicleService;
import ar.edu.itba.parkingmanagmentapi.util.UserMapper;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;
    private final SecurityService securityService;

    private final VehicleService vehicleService;


    public UserController(UserService userService, SecurityService securityService, VehicleService vehicleService) {
        this.userService = userService;
        this.securityService = securityService;
        this.vehicleService = vehicleService;
    }

    /**
     * Crea un nuevo usuario
     */
    @PostMapping
    public ResponseEntity<?> createUser(@Valid @RequestBody CreateUserRequest user) {
        UserResponse createdUser = userService.createUser(user);
        return ApiResponse.created(createdUser);
    }

    @GetMapping
    public ResponseEntity<?> getAllUsers() {
        List<UserResponse> users = userService.findAll();
        return ApiResponse.ok(users);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        UserResponse user = userService.findById(id);
        return ApiResponse.ok(user);
    }

    @PutMapping("/{id}")
    @PreAuthorize("@authorizationService.isCurrentUser(#id)")
    public ResponseEntity<?> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserRequest userDetails) {
        UserResponse updatedUser = userService.updateUser(id, userDetails);
        return ApiResponse.ok(updatedUser);
    }


    @DeleteMapping("/{id}")
    @PreAuthorize("@authorizationService.isCurrentUser(#id)")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ApiResponse.noContent();
    }

    // -------------------------- EXTENSIONS --------------------------

    @GetMapping("/{id}/vehicles")
    public ResponseEntity<?> getAllVehicles(@PathVariable Long id) {
        List<VehicleResponse> response = vehicleService.findAllVehiclesByUser(id);
        return ApiResponse.ok(response);
    }

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getCurrentUser() {
        //FIXME: The UserResponse mapping should be done at service layer.
        UserResponse currentUser = securityService.getCurrentUser()
                .map(UserMapper::toUserResponse)
                .orElseThrow(() -> new AuthenticationFailedException("No authenticated user found"));
        return ApiResponse.ok(currentUser);
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchUsers(@RequestParam String q) {
        List<UserResponse> users = userService.searchUsers(q);
        return ApiResponse.ok(users);
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<?> getUserByEmail(@PathVariable String email) {
        UserResponse user = userService.findByEmail(email);
        return ApiResponse.ok(user);
    }

}
