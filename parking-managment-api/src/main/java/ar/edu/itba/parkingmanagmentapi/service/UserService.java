package ar.edu.itba.parkingmanagmentapi.service;

import ar.edu.itba.parkingmanagmentapi.model.User;

import java.util.List;
import java.util.Optional;

public interface UserService {

    /**
     * Crea un nuevo usuario
     */
    User createUser(User user);

    /**
     * Actualiza un usuario existente
     */
    User updateUser(Long id, User userDetails);

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
