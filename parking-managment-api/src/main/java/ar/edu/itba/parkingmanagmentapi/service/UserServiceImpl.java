package ar.edu.itba.parkingmanagmentapi.service;

import ar.edu.itba.parkingmanagmentapi.model.User;
import ar.edu.itba.parkingmanagmentapi.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {
    Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Crea un nuevo usuario
     * */
    @Override
    public User createUser(User user) {
        // Verificar que el email no exista
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("El email ya está registrado");
        }
        
        // Encriptar la contraseña
        user.setPasswordHash(passwordEncoder.encode(user.getPasswordHash()));
        
        return userRepository.save(user);
    }
    
    /**
     * Actualiza un usuario existente
     */
    @Override
    public User updateUser(Long id, User userDetails) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        // Verificar que el email no esté en uso por otro usuario
        if (!user.getEmail().equals(userDetails.getEmail()) && 
            userRepository.existsByEmail(userDetails.getEmail())) {
            throw new RuntimeException("El email ya está registrado");
        }
        
        user.setFirstName(userDetails.getFirstName());
        user.setLastName(userDetails.getLastName());
        user.setEmail(userDetails.getEmail());
        user.setImageUrl(userDetails.getImageUrl());
        
        // Solo actualizar contraseña si se proporciona una nueva
        if (userDetails.getPasswordHash() != null && !userDetails.getPasswordHash().isEmpty()) {
            user.setPasswordHash(passwordEncoder.encode(userDetails.getPasswordHash()));
        }
        
        return userRepository.save(user);
    }
    
    /**
     * Busca un usuario por ID
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    /**
     * Lista todos los usuarios
     */
    @Override
    @Transactional(readOnly = true)
    public List<User> findAll() {
        return userRepository.findAll();
    }

    /**
     * Busca usuarios por término de búsqueda
     */
    @Override
    @Transactional(readOnly = true)
    public List<User> searchUsers(String searchTerm) {
        return userRepository.findByFirstNameOrLastNameContainingIgnoreCase(searchTerm);
    }

    /**
     * Elimina un usuario
     */
    @Override
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        userRepository.delete(user);
    }
    
    /**
     * Verifica las credenciales de un usuario
     */
    @Override
    @Transactional(readOnly = true)
    public boolean verifyCredentials(String email, String password) {
        Optional<User> user = userRepository.findByEmail(email);
        return user.isPresent() && passwordEncoder.matches(password, user.get().getPasswordHash());
    }

} 