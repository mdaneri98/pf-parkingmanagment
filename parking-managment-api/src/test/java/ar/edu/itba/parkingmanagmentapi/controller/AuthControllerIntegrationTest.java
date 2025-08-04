package ar.edu.itba.parkingmanagmentapi.controller;

import ar.edu.itba.parkingmanagmentapi.BaseIntegrationTest;
import ar.edu.itba.parkingmanagmentapi.builder.TestDataBuilder;
import ar.edu.itba.parkingmanagmentapi.dto.LoginResponse;
import ar.edu.itba.parkingmanagmentapi.dto.RegisterResponse;
import ar.edu.itba.parkingmanagmentapi.model.User;
import ar.edu.itba.parkingmanagmentapi.repository.ManagerRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

class AuthControllerIntegrationTest extends BaseIntegrationTest {

    // ========== REGISTER TESTS ==========

    @Test
    void testRegister_shouldReturn201_andUserIsPersisted() {
        // 1. Arrange
        var request = TestDataBuilder.createValidRegisterRequest();

        // 2. Act
        ResponseEntity<String> response = restTemplate.postForEntity(getApiUrl("/auth/register"), request, String.class);

        // 3. Assert
        assertResponseStatus(response, HttpStatus.CREATED);
        assertResponseBodyNotEmpty(response);

        var apiResponse = parseApiResponse(response, RegisterResponse.class);
        assertApiResponseSuccess(apiResponse);
        assertEquals("john.doe@example.com", apiResponse.getData().getEmail());

        // Verify user is persisted in database
        Optional<User> savedUserOpt = userRepository.findByEmail("john.doe@example.com");
        assertTrue(savedUserOpt.isPresent());

        User savedUser = savedUserOpt.get();
        assertEquals("John", savedUser.getFirstName());
        assertEquals("Doe", savedUser.getLastName());
        assertEquals("john.doe@example.com", savedUser.getEmail());
        assertNotNull(savedUser.getPasswordHash());
        assertNotEquals("securePassword123", savedUser.getPasswordHash());
        assertTrue(passwordEncoder.matches("securePassword123", savedUser.getPasswordHash()));
    }

    @Test
    void testRegister_asManager_shouldReturn201_andUserAndManagerArePersisted() {
        // 1. Arrange
        var request = TestDataBuilder.createValidRegisterRequest();

        // 2. Act
        ResponseEntity<String> response = restTemplate.postForEntity(
            getApiUrl("/auth/register?manager=true"), request, String.class);

        // 3. Assert
        assertResponseStatus(response, HttpStatus.CREATED);
        assertResponseBodyNotEmpty(response);

        var apiResponse = parseApiResponse(response, RegisterResponse.class);
        assertApiResponseSuccess(apiResponse);
        assertEquals("john.doe@example.com", apiResponse.getData().getEmail());

        // Verify user is persisted in database
        Optional<User> savedUserOpt = userRepository.findByEmail("john.doe@example.com");
        assertTrue(savedUserOpt.isPresent());

        User savedUser = savedUserOpt.get();
        assertEquals("John", savedUser.getFirstName());
        assertEquals("Doe", savedUser.getLastName());
        assertEquals("john.doe@example.com", savedUser.getEmail());
        assertNotNull(savedUser.getPasswordHash());
        assertNotEquals("securePassword123", savedUser.getPasswordHash());
        assertTrue(passwordEncoder.matches("securePassword123", savedUser.getPasswordHash()));

        // Verify manager is also persisted
        assertTrue(managerRepository.existsByUserId(savedUser.getId()));
    }

    @Test
    void testRegister_asNormalUser_shouldReturn201_andOnlyUserIsPersisted() {
        // 1. Arrange
        var request = TestDataBuilder.createValidRegisterRequest();

        // 2. Act
        ResponseEntity<String> response = restTemplate.postForEntity(
            getApiUrl("/auth/register?manager=false"), request, String.class);

        // 3. Assert
        assertResponseStatus(response, HttpStatus.CREATED);
        assertResponseBodyNotEmpty(response);

        var apiResponse = parseApiResponse(response, RegisterResponse.class);
        assertApiResponseSuccess(apiResponse);
        assertEquals("john.doe@example.com", apiResponse.getData().getEmail());

        // Verify user is persisted in database
        Optional<User> savedUserOpt = userRepository.findByEmail("john.doe@example.com");
        assertTrue(savedUserOpt.isPresent());

        User savedUser = savedUserOpt.get();
        assertEquals("John", savedUser.getFirstName());
        assertEquals("Doe", savedUser.getLastName());
        assertEquals("john.doe@example.com", savedUser.getEmail());
        assertNotNull(savedUser.getPasswordHash());
        assertNotEquals("securePassword123", savedUser.getPasswordHash());
        assertTrue(passwordEncoder.matches("securePassword123", savedUser.getPasswordHash()));

        // Verify manager is NOT persisted
        assertFalse(managerRepository.existsByUserId(savedUser.getId()));
    }

    // ========== LOGIN TESTS ==========

    @Test
    void testLogin_withValidCredentials_shouldReturn200_andToken() {
        // Create a user first
        String email = "login.test@example.com";
        String password = "securePassword123";

        createTestUser(email, password);

        // Attempt login
        var request = TestDataBuilder.createLoginRequest(email, password);

        ResponseEntity<String> response = restTemplate.postForEntity(getApiUrl("/auth/login"), request, String.class);

        assertResponseStatus(response, HttpStatus.OK);
        assertResponseBodyNotEmpty(response);

        // Verify the response structure
        var apiResponse = parseApiResponse(response, LoginResponse.class);
        assertApiResponseSuccess(apiResponse);
        assertEquals(email, apiResponse.getData().getEmail());
        assertNotNull(apiResponse.getData().getToken(), "El token debe estar presente");
    }

    @Test
    void testLogin_withInvalidEmail_shouldReturn401() {
        var request = TestDataBuilder.createLoginRequest("nonexistent@example.com", "anyPassword");

        ResponseEntity<String> response = restTemplate.postForEntity(getApiUrl("/auth/login"), request, String.class);

        assertResponseStatus(response, HttpStatus.UNAUTHORIZED);
        assertResponseBodyNotEmpty(response);

        var apiResponse = parseApiResponse(response, Void.class);
        assertApiResponseFailure(apiResponse);
    }

    @Test
    void testLogin_withInvalidPassword_shouldReturn401() {
        // 1. Arrange
        String email = "password.test@example.com";
        String correctPassword = "correctPassword123";

        createTestUser(email, correctPassword);

        // 2. Act
        var request = TestDataBuilder.createLoginRequest(email, "wrongPassword");

        // 3. Assert
        ResponseEntity<String> response = restTemplate.postForEntity(getApiUrl("/auth/login"), request, String.class);

        assertResponseStatus(response, HttpStatus.UNAUTHORIZED);
        assertResponseBodyNotEmpty(response);

        var apiResponse = parseApiResponse(response, Void.class);
        assertApiResponseFailure(apiResponse);
    }

    @ParameterizedTest
    @CsvSource({
            // Casos inválidos de email y/o password
            ", password123",                   // email null
            "'', password123",                 // email vacío
            "test@example.com, ''",            // password vacío
    })
    void testLogin_withInvalidInput_shouldReturn400(String email, String password) {
        var request = TestDataBuilder.createLoginRequest(email, password);

        ResponseEntity<String> response = restTemplate.postForEntity(getApiUrl("/auth/login"), request, String.class);
        assertResponseStatus(response, HttpStatus.BAD_REQUEST);
    }

    @Test
    void testLogin_afterRegister_shouldWork() {
        // First register a user
        var registerRequest = TestDataBuilder.createRegisterRequest("Integration", "Test", "test@example.com", "Password123");

        //TODO: yo no haria las 2 pegadas, mockearia la primera, es decir, hago el save en la BD con credenciales, no se que te parece?
        ResponseEntity<String> registerResponse = restTemplate.postForEntity(getApiUrl("/auth/register"), registerRequest, String.class);
        assertResponseStatus(registerResponse, HttpStatus.CREATED);

        // Then login with the same credentials
        var loginRequest = TestDataBuilder.createLoginRequest("test@example.com", "Password123");

        ResponseEntity<String> loginResponse = restTemplate.postForEntity(getApiUrl("/auth/login"), loginRequest, String.class);
        assertResponseStatus(loginResponse, HttpStatus.OK);

        // Verify login response
        var apiResponse = parseApiResponse(loginResponse, LoginResponse.class);
        assertApiResponseSuccess(apiResponse);
        assertEquals("test@example.com", apiResponse.getData().getEmail());
        assertNotNull(apiResponse.getData().getToken());
    }
} 