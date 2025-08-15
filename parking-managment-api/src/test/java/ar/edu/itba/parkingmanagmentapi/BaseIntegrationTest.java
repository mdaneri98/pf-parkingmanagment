package ar.edu.itba.parkingmanagmentapi;

import ar.edu.itba.parkingmanagmentapi.dto.ApiResponse;
import ar.edu.itba.parkingmanagmentapi.dto.LoginRequest;
import ar.edu.itba.parkingmanagmentapi.dto.LoginResponse;
import ar.edu.itba.parkingmanagmentapi.model.Manager;
import ar.edu.itba.parkingmanagmentapi.model.User;
import ar.edu.itba.parkingmanagmentapi.repository.ManagerRepository;
import ar.edu.itba.parkingmanagmentapi.repository.AdminRepository;
import ar.edu.itba.parkingmanagmentapi.model.Admin;
import ar.edu.itba.parkingmanagmentapi.repository.UserRepository;
import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Base class for all integration tests in the application.
 * Provides common setup, utilities, and helper methods for testing.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
@TestPropertySource(locations = "classpath:application-test.yml")
public abstract class BaseIntegrationTest {

    @Autowired
    protected TestRestTemplate restTemplate;

    @Autowired
    protected UserRepository userRepository;

    @Autowired
    protected ManagerRepository managerRepository;

    @Autowired
    protected AdminRepository adminRepository;

    @Autowired
    protected PasswordEncoder passwordEncoder;

    @Autowired
    protected ObjectMapper objectMapper;

    protected TestUser normalUser;
    protected TestUser adminUser;
    protected TestUser managerUser;
    
    @BeforeEach
    void clean() {
        adminRepository.deleteAll();
        managerRepository.deleteAll();
        userRepository.deleteAll();
        setupTestUsers();
    }

    /**
     * Setup method to create and authenticate test users.
     */
    protected void setupTestUsers() {
        // Create normal user
        User normalUserEntity = createTestUser("normal@test.com", "password123");
        String normalUserToken = authenticateUser("normal@test.com", "password123");
        normalUser = new TestUser(normalUserEntity, normalUserToken);

        // Create admin user
        User adminUserEntity = createTestUser("admin@admin.com", "password123");
        adminRepository.save(new Admin(adminUserEntity));
        String adminUserToken = authenticateUser("admin@admin.com", "password123");
        adminUser = new TestUser(adminUserEntity, adminUserToken);

        // Create manager user
        User managerUserEntity = createTestUser("manager@test.com", "password123");
        Manager manager = new Manager(managerUserEntity);
        managerRepository.save(manager);
        String managerUserToken = authenticateUser("manager@test.com", "password123");
        managerUser = new TestUser(managerUserEntity, managerUserToken);
    }

    /**
     * Authenticates a user and returns the JWT token
     */
    private String authenticateUser(String email, String password) {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail(email);
        loginRequest.setPassword(password);

        ResponseEntity<String> response = restTemplate.postForEntity(
                getApiUrl("/auth/login"),
                loginRequest,
                String.class
        );

        if (response.getStatusCode().is2xxSuccessful()) {
            try {
                ApiResponse<LoginResponse> apiResponse = parseApiResponse(response, LoginResponse.class);
                return apiResponse.getData().getToken();
            } catch (Exception e) {
                fail("Failed to parse login response: " + e.getMessage());
                return null;
            }
        } else {
            fail("Login failed for user " + email + ": " + response.getStatusCode());
            return null;
        }
    }

    /**
     * Asserts that a response has the expected HTTP status code.
     */
    protected void assertResponseStatus(ResponseEntity<?> response, HttpStatus expectedStatus) {
        assertEquals(expectedStatus, response.getStatusCode(),
                "Expected status " + expectedStatus + " but got " + response.getStatusCode());
    }

    /**
     * Asserts that a response is successful (2xx status code).
     */
    protected void assertResponseSuccess(ResponseEntity<?> response) {
        assertTrue(response.getStatusCode().is2xxSuccessful(),
                "Expected successful response but got " + response.getStatusCode());
    }

    /**
     * Asserts that a response is a client error (4xx status code).
     */
    protected void assertResponseClientError(ResponseEntity<?> response) {
        assertTrue(response.getStatusCode().is4xxClientError(),
                "Expected client error but got " + response.getStatusCode());
    }

    /**
     * Asserts that a response is a server error (5xx status code).
     */
    protected void assertResponseServerError(ResponseEntity<?> response) {
        assertTrue(response.getStatusCode().is5xxServerError(),
                "Expected server error but got " + response.getStatusCode());
    }

    /**
     * Parses a JSON response into an ApiResponse object.
     */
    protected <T> ApiResponse<T> parseApiResponse(ResponseEntity<String> response, Class<T> dataType) {
        try {
            JavaType type = objectMapper.getTypeFactory().constructParametricType(ApiResponse.class, dataType);
            return objectMapper.readValue(response.getBody(), type);
        } catch (Exception e) {
            fail("Failed to parse response: " + e.getMessage() + "\nResponse body: " + response.getBody());
            return null;
        }
    }


    /**
     * Asserts that an ApiResponse is successful and contains data.
     */
    protected <T> void assertApiResponseSuccess(ApiResponse<T> apiResponse) {
        assertTrue(apiResponse.isSuccess(), "API response should be successful");
        assertNotNull(apiResponse.getData(), "API response should contain data");
    }

    /**
     * Asserts that an ApiResponse indicates failure and contains an error message.
     */
    protected <T> void assertApiResponseFailure(ApiResponse<T> apiResponse) {
        assertFalse(apiResponse.isSuccess(), "API response should indicate failure");
        assertNotNull(apiResponse.getMessage(), "API response should contain error message");
    }

    /**
     * Asserts that a response body is not null and not empty.
     */
    protected void assertResponseBodyNotEmpty(ResponseEntity<String> response) {
        assertNotNull(response.getBody(), "Response body should not be null");
        assertFalse(response.getBody().trim().isEmpty(), "Response body should not be empty");
    }

    /**
     * Creates a user in the database for testing purposes.
     */
    protected User createTestUser(String email, String password) {
        User user = new User();
        user.setFirstName("Test");
        user.setLastName("User");
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(password));
        return userRepository.save(user);
    }

    /**
     * Creates a test user with default credentials.
     */
    protected User createTestUser() {
        return createTestUser("test@example.com", "password123");
    }

    /**
     * Gets the base URL for API endpoints, including the context path.
     */
    protected String getApiUrl(String endpoint) {
        return endpoint;
    }

    /**
     * Creates an HTTP header with the Authorization Bearer token for a test user
     */
    protected org.springframework.http.HttpHeaders createAuthHeaders(TestUser testUser) {
        org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
        headers.set("Authorization", "Bearer " + testUser.getToken());
        headers.set("Content-Type", "application/json");
        return headers;
    }

    /**
     * Creates an HTTP header with the Authorization Bearer token for a test user
     */
    protected org.springframework.http.HttpHeaders createAuthHeaders(String token) {
        org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
        headers.set("Authorization", "Bearer " + token);
        headers.set("Content-Type", "application/json");
        return headers;
    }

 /**
     * Inner class to hold user and token information for testing
     */
    protected static class TestUser {
        private final User user;
        private final String token;

        public TestUser(User user, String token) {
            this.user = user;
            this.token = token;
        }

        public User getUser() {
            return user;
        }

        public String getToken() {
            return token;
        }

        public String getEmail() {
            return user.getEmail();
        }

        public Long getId() {
            return user.getId();
        }
    }

} 