package ar.edu.itba.parkingmanagmentapi.builder;

import ar.edu.itba.parkingmanagmentapi.dto.CreateUserRequest;
import ar.edu.itba.parkingmanagmentapi.dto.LoginRequest;
import ar.edu.itba.parkingmanagmentapi.dto.RegisterRequest;
import ar.edu.itba.parkingmanagmentapi.model.User;
import ar.edu.itba.parkingmanagmentapi.model.UserDetail;

/**
 * Utility class for building test data objects.
 * This class provides factory methods to create consistent test data across all tests.
 */
public class TestDataBuilder {

    /**
     * Creates a valid RegisterRequest for testing.
     */
    public static RegisterRequest createValidRegisterRequest() {
        RegisterRequest request = new RegisterRequest();
        request.setFirstName("John");
        request.setLastName("Doe");
        request.setEmail("john.doe@example.com");
        request.setPassword("securePassword123");
        return request;
    }

    /**
     * Creates a RegisterRequest with custom values.
     */
    public static RegisterRequest createRegisterRequest(String firstName, String lastName, String email, String password) {
        RegisterRequest request = new RegisterRequest();
        request.setFirstName(firstName);
        request.setLastName(lastName);
        request.setEmail(email);
        request.setPassword(password);
        return request;
    }

    /**
     * Creates a valid LoginRequest for testing.
     */
    public static LoginRequest createValidLoginRequest() {
        LoginRequest request = new LoginRequest();
        request.setEmail("test@example.com");
        request.setPassword("securePassword123");
        return request;
    }

    /**
     * Creates a LoginRequest with custom values.
     */
    public static LoginRequest createLoginRequest(String email, String password) {
        LoginRequest request = new LoginRequest();
        request.setEmail(email);
        request.setPassword(password);
        return request;
    }

    /**
     * Creates a valid CreateUserRequest for testing.
     */
    public static CreateUserRequest createValidCreateUserRequest() {
        CreateUserRequest request = new CreateUserRequest();
        request.setEmail("test@example.com");
        request.setPassword("securePassword123");
        return request;
    }

    /**
     * Creates a CreateUserRequest with custom values.
     */
    public static CreateUserRequest createCreateUserRequest(String email, String password) {
        CreateUserRequest request = new CreateUserRequest();
        request.setEmail(email);
        request.setPassword(password);
        return request;
    }

    public static User createUserComplete() {
        User user = new User();
        user.setEmail("test@example.com");
        user.setPasswordHash("hashedPassword");
        user.setFirstName("Test");
        user.setLastName("Lastname");
        user.setImageUrl("http://example.com/image.jpg");
        UserDetail detail = new UserDetail();
        detail.setPhone("123456");
        detail.setAddress("falsa 123");
        detail.setUser(user);
        user.setUserDetail(detail);
        return user;
    }

    /**
     * Creates a valid User entity for testing.
     */
    public static User createValidUser() {
        User user = new User();
        user.setFirstName("Test");
        user.setLastName("User");
        user.setEmail("test@example.com");
        user.setPasswordHash("hashedPassword");
        return user;
    }

    /**
     * Creates a User entity with custom values.
     */
    public static User createUser(String firstName, String lastName, String email) {
        User user = new User();
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setEmail(email);
        return user;
    }

} 