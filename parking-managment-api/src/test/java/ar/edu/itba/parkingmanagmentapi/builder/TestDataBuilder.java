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

    /**
     * Test email addresses for validation testing.
     */
    public static class TestEmails {
        public static final String VALID = "test@example.com";
        public static final String INVALID_NO_AT = "plainaddress";
        public static final String INVALID_NO_LOCAL = "@no-local.com";
        public static final String INVALID_NO_DOMAIN = "missingatsign.com";
        public static final String INVALID_MISSING_DOMAIN = "missing.domain@.com";
        public static final String INVALID_IP_FORMAT = "email@111.222.333.44444";
        public static final String INVALID_DOUBLE_AT = "two@@signs.com";
        public static final String INVALID_WITH_ANGLE_BRACKETS = "Outlook Contact <outlook-contact@domain.com>";
    }

    /**
     * Test passwords for validation testing.
     */
    public static class TestPasswords {
        public static final String VALID = "securePassword123";
        public static final String TOO_SHORT = "123";
        public static final String EMPTY = "";
    }

    /**
     * Test names for validation testing.
     */
    public static class TestNames {
        public static final String VALID_FIRST_NAME = "John";
        public static final String VALID_LAST_NAME = "Doe";
        public static final String TOO_LONG = "a".repeat(101); // More than 100 characters
        public static final String EMPTY = "";
    }
} 