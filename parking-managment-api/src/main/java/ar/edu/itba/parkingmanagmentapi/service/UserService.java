package ar.edu.itba.parkingmanagmentapi.service;

import ar.edu.itba.parkingmanagmentapi.dto.CreateUserRequest;
import ar.edu.itba.parkingmanagmentapi.dto.UserResponse;
import ar.edu.itba.parkingmanagmentapi.dto.UpdateUserRequest;
import ar.edu.itba.parkingmanagmentapi.model.User;

import java.util.List;
import java.util.Optional;

public interface UserService {

    /**
     * Crea un nuevo usuario
     */
    UserResponse createUser(CreateUserRequest user);

    /**
     * Actualiza un usuario existente
     */
    UserResponse updateUser(Long id, UpdateUserRequest userDetails);

    /**
     * Busca un usuario por ID
     */
    Optional<User> findById(Long id);

    /**
     * Lista todos los usuarios
     */
    List<User> findAll();

    /**
     * Busca usuarios por término de búsqueda
     */
     List<User> searchUsers(String searchTerm);

    /**
     * Elimina un usuario
     */
    void deleteUser(Long id);

    /**
     * Verifica las credenciales de un usuario
     */
    boolean verifyCredentials(String email, String password);

}
