package ar.edu.itba.parkingmanagmentapi.service;

import ar.edu.itba.parkingmanagmentapi.dto.CreateUserRequest;
import ar.edu.itba.parkingmanagmentapi.dto.UpdateUserRequest;
import ar.edu.itba.parkingmanagmentapi.dto.UserResponse;
import ar.edu.itba.parkingmanagmentapi.exceptions.BadRequestException;
import ar.edu.itba.parkingmanagmentapi.exceptions.NotFoundException;
import ar.edu.itba.parkingmanagmentapi.model.User;
import ar.edu.itba.parkingmanagmentapi.model.UserDetail;
import ar.edu.itba.parkingmanagmentapi.repository.UserRepository;
import ar.edu.itba.parkingmanagmentapi.util.UserMapper;
import ar.edu.itba.parkingmanagmentapi.validators.CreateUserRequestValidator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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
     * Creates a new user
     */
    @Override
    public UserResponse createUser(CreateUserRequest userRequest) {
        createUserRequestValidator.validate(userRequest);

        if (userRepository.existsByEmail(userRequest.getEmail())) {
            throw new BadRequestException(String.format("The email %s is already in use", userRequest.getEmail()));
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
     * Updates an existing user
     */
    @Override
    public UserResponse updateUser(Long id, UpdateUserRequest user) {
        User userSaved = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("User not found"));

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
     * Finds a user by ID
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<UserResponse> findById(Long id) {
        return userRepository.findById(id)
                .map(UserMapper::toUserResponse);
    }

    /**
     * Finds a user by Email
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
        //TODO: deberia quedar asi, analizar como quedaria esta respuesta, porque no podemos pasar el password
        /*return userRepository.findByEmail(email)
                .map(UserMapper::toUserResponse)
                .orElseThrow(() -> new NotFoundException("User not found with email: " + email));*/
    }

    /**
     * Lists all users
     */
    @Override
    @Transactional(readOnly = true)
    public List<UserResponse> findAll() {
        return userRepository.findAll()
                .stream()
                .map(UserMapper::toUserResponse)
                .collect(Collectors.toList());
    }

    /**
     * Searches users by search term
     */
    @Override
    @Transactional(readOnly = true)
    public List<UserResponse> searchUsers(String searchTerm) {
        return userRepository.findByFirstNameOrLastNameContainingIgnoreCase(searchTerm)
                .stream()
                .map(UserMapper::toUserResponse)
                .collect(Collectors.toList());
    }

    /**
     * Deletes a user
     */
    @Override
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("User not found"));
        userRepository.delete(user);
    }

    /**
     * Verifies user credentials
     */
    @Override
    @Transactional(readOnly = true)
    public boolean verifyCredentials(String email, String password) {
        Optional<User> user = userRepository.findByEmail(email);
        return user.isPresent() && passwordEncoder.matches(password, user.get().getPasswordHash());
    }

} 