package ar.edu.itba.parkingmanagmentapi;

import ar.edu.itba.parkingmanagmentapi.dto.ApiResponse;
import ar.edu.itba.parkingmanagmentapi.model.User;
import ar.edu.itba.parkingmanagmentapi.repository.ManagerRepository;
import ar.edu.itba.parkingmanagmentapi.repository.UserRepository;
import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.ObjectMapper;
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
    protected PasswordEncoder passwordEncoder;

    @Autowired
    protected ObjectMapper objectMapper;


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
} 