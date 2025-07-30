package ar.edu.itba.parkingmanagmentapi.service;

import ar.edu.itba.parkingmanagmentapi.dto.CreateUserRequest;
import ar.edu.itba.parkingmanagmentapi.dto.UpdateUserRequest;
import ar.edu.itba.parkingmanagmentapi.dto.UserResponse;
import ar.edu.itba.parkingmanagmentapi.model.User;

import java.util.List;

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
     * Finds a user by Email
     */
    Optional<User> findByEmail(String email);

    /**
     * Lists all users
     */
    List<UserResponse> findAll();

    /**
     * Searches users by search term
     */
    List<UserResponse> searchUsers(String searchTerm);

    /**
     * Deletes a user
     */
    void deleteUser(Long id);

    /**
     * Verifies user credentials
     */
    boolean verifyCredentials(String email, String password);

}
