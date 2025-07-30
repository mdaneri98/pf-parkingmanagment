package ar.edu.itba.parkingmanagmentapi.controller;

import ar.edu.itba.parkingmanagmentapi.dto.CreateUserRequest;
import ar.edu.itba.parkingmanagmentapi.dto.UpdateUserRequest;
import ar.edu.itba.parkingmanagmentapi.dto.UserResponse;
import ar.edu.itba.parkingmanagmentapi.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // -------------------------- BASIC CRUD --------------------------

    /**
     * Crea un nuevo usuario
     */
    @PostMapping
    public ResponseEntity<UserResponse> createUser(@RequestBody CreateUserRequest user) {
        UserResponse createdUser = userService.createUser(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
    }

    /**
     * Obtiene todos los usuarios
     */
    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        List<UserResponse> users = userService.findAll();
        return ResponseEntity.ok(users);
    }

    /**
     * Obtiene un usuario por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
        Optional<UserResponse> user = userService.findById(id);
        return user.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Actualiza un usuario
     */
    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> updateUser(@PathVariable Long id, @Valid @RequestBody UpdateUserRequest userDetails) {
        UserResponse updatedUser = userService.updateUser(id, userDetails);
        return ResponseEntity.ok(updatedUser);
    }

    /**
     * Elimina un usuario
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }


    // -------------------------- EXTENSIONS --------------------------

    /**
     * Busca usuarios por término de búsqueda
     */
    @GetMapping("/search")
    public ResponseEntity<List<UserResponse>> searchUsers(@RequestParam String q) {
        List<UserResponse> users = userService.searchUsers(q);
        return ResponseEntity.ok(users);
    }

} 