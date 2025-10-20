package ar.edu.itba.parkingmanagmentapi.service;

import ar.edu.itba.parkingmanagmentapi.config.AppConstants;
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
import ar.edu.itba.parkingmanagmentapi.validators.UpdatedUserRequestedValidator;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    private final CreateUserRequestValidator createUserRequestValidator;
    private final UpdatedUserRequestedValidator updatedUserRequestValidator;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(CreateUserRequestValidator createUserRequestValidator, UpdatedUserRequestedValidator updatedUserRequestValidator, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.createUserRequestValidator = createUserRequestValidator;
        this.updatedUserRequestValidator = updatedUserRequestValidator;
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
            throw new BadRequestException("user.email.already_exists", userRequest.getEmail());
        }

        User user = new User();
        user.setEmail(userRequest.getEmail());
        user.setFirstName(userRequest.getFirstName());
        user.setLastName(userRequest.getLastName());
        user.setImageUrl(userRequest.getImageUrl());
        user.setPasswordHash(passwordEncoder.encode(userRequest.getPassword()));
        user.setUserDetail(new UserDetail());

        userRepository.save(user);

        return UserResponse.builder()
                .id(user.getId())
                .firstName(userRequest.getFirstName())
                .lastName(userRequest.getLastName())
                .email(user.getEmail())
                .imageUrl(userRequest.getImageUrl())
                .build();
    }

    /**
     * Updates an existing user
     */
    @Override
    public UserResponse updateUser(Long id, UpdateUserRequest user) {
        updatedUserRequestValidator.validate(user);
        
        User userSaved = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("user.not.found"));

        userSaved.setFirstName(user.getFirstName());
        userSaved.setLastName(user.getLastName());
        userSaved.setImageUrl(user.getImageUrl());
        userSaved.getUserDetail().setPhone(user.getUserDetail().getPhone());
        userSaved.getUserDetail().setAddress(user.getUserDetail().getAddress());
        userSaved.getUserDetail().setLang(user.getUserDetail().getLang());
        userRepository.save(userSaved);

        return UserMapper.toUserResponse(userSaved);
    }

    /**
     * Finds a user by ID
     */
    @Override
    @Transactional(readOnly = true)
    public UserResponse findById(Long id) {
        return userRepository.findById(id)
                .map(UserMapper::toUserResponse)
                .orElseThrow(() -> new NotFoundException("user.not.found"));
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
     * Deletes a user
     */
    @Override
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("User not found"));
        userRepository.delete(user);
    }

    // -------------------------- EXTENSIONS --------------------------

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
     * Finds a user by Email
     */
    @Override
    @Transactional(readOnly = true)
    public UserResponse findByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(UserMapper::toUserResponse)
                .orElseThrow(() -> new NotFoundException("User not found with email: " + email));
    }

    // -------------------------- RAW ENTITIES --------------------------

    /**
     * Finds a raw user by Email
     */
    @Override
    public Optional<User> findEntityByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    /**
     * Find default user
     */
    @Override
    public User findDefaulUser() {
        return userRepository.findById(AppConstants.DEFAULT_USER_ID)
                .orElseThrow(() -> new NotFoundException("There is no default user"));
    }
}