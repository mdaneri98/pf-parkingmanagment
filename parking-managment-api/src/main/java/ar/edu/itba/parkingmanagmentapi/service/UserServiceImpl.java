package ar.edu.itba.parkingmanagmentapi.service;

import ar.edu.itba.parkingmanagmentapi.dto.CreateUserRequest;
import ar.edu.itba.parkingmanagmentapi.dto.UpdateUserRequest;
import ar.edu.itba.parkingmanagmentapi.dto.UserResponse;
import ar.edu.itba.parkingmanagmentapi.model.User;
import ar.edu.itba.parkingmanagmentapi.model.UserDetail;
import ar.edu.itba.parkingmanagmentapi.repository.UserRepository;
import ar.edu.itba.parkingmanagmentapi.validators.CreateUserRequestValidator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {
    Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);
    private final CreateUserRequestValidator createUserRequestValidator;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(CreateUserRequestValidator createUserRequestValidator, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.createUserRequestValidator = createUserRequestValidator;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Crea un nuevo usuario
     */
    @Override
    public UserResponse createUser(CreateUserRequest userRequest) {
        createUserRequestValidator.validate(userRequest);

        if (userRepository.existsByEmail(userRequest.getEmail())) {
            throw new RuntimeException("El email ya está registrado");
        }

        User user = new User();
        user.setEmail(userRequest.getEmail());
        user.setPasswordHash(passwordEncoder.encode(userRequest.getPassword()));
        userRepository.save(user);

        return UserResponse.builder()
                .email(user.getEmail())
                .build();
    }

    /**
     * Actualiza un usuario existente
     */
    @Override
    public UserResponse updateUser(Long id, UpdateUserRequest user) {
        User userSaved = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        userSaved.setFirstName(user.getFirstName());
        userSaved.setLastName(user.getLastName());
        userSaved.setImageUrl(user.getImageUrl());
        userSaved.setUserDetail(Optional.ofNullable(user.getUserDetail())
                .map(userDetail -> new UserDetail())
                .orElse(null));
        userRepository.save(userSaved);

        return UserResponse.builder().firstName(user.getFirstName()).build();
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