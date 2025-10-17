package ar.edu.itba.parkingmanagmentapi.service;

import ar.edu.itba.parkingmanagmentapi.dto.CreateUserRequest;
import ar.edu.itba.parkingmanagmentapi.dto.UpdateUserRequest;
import ar.edu.itba.parkingmanagmentapi.dto.UserResponse;
import ar.edu.itba.parkingmanagmentapi.model.User;

import java.util.List;
import java.util.Optional;

public interface UserService {

    /**
     * Creates a new user
     */
    UserResponse createUser(CreateUserRequest user);

    /**
     * Updates an existing user
     */
    UserResponse updateUser(Long id, UpdateUserRequest userDetails);

    /**
     * Finds a user by ID
     */
    UserResponse findById(Long id);

    /**
     * Lists all users
     */
    List<UserResponse> findAll();

    /**
     * Deletes a user
     */
    void deleteUser(Long id);

    // -------------------------- EXTENSIONS --------------------------

    /**
     * Searches users by search term
     */
    List<UserResponse> searchUsers(String searchTerm);

    /**
     * Finds a user by Email
     */
    UserResponse findByEmail(String email);

    // -------------------------- RAW EXTENSIONS --------------------------

    /**
     * Finds a raw user by Email
     */
    Optional<User> findEntityByEmail(String email);

    /**
     * Get the default user
     */
    User findDefaulUser();

}
