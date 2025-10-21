package ar.edu.itba.parkingmanagmentapi.controller;

import ar.edu.itba.parkingmanagmentapi.BaseIntegrationTest;
import ar.edu.itba.parkingmanagmentapi.builder.TestDataBuilder;
import ar.edu.itba.parkingmanagmentapi.dto.*;
import ar.edu.itba.parkingmanagmentapi.model.User;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

class AuthControllerIntegrationTest extends BaseIntegrationTest {
    // ========== REGISTER TESTS ==========
    @Test
    void testRegister_shouldReturn201_andUserIsPersisted() {
        RegisterRequest request = TestDataBuilder.createValidRegisterRequest();

        ResponseEntity<ApiResponse<RegisterResponse>> response = restTemplate.exchange(
                getApiUrl("/auth/register"),
                HttpMethod.POST,
                new HttpEntity<>(request),
                new ParameterizedTypeReference<>() {
                }
        );

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().isSuccess());
        assertEquals("john.doe@example.com", response.getBody().getData().getEmail());

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
    void testRegister_shouldFail_whenEmailAlreadyExists() {
        RegisterRequest request = TestDataBuilder.createValidRegisterRequest();
        request.setEmail(TestDataBuilder.createUserComplete().getEmail());
        userRepository.save(TestDataBuilder.createUserComplete());

        ResponseEntity<ApiResponse<Void>> response = restTemplate.exchange(
                getApiUrl("/auth/register"),
                HttpMethod.POST,
                new HttpEntity<>(request),
                new ParameterizedTypeReference<>() {
                }
        );

        assertEquals(HttpStatus.CONFLICT, response.getStatusCode());
        assertNotNull(response.getBody());
        assertFalse(response.getBody().isSuccess());
        assertTrue(response.getBody().getMessage().contains("Email already registered"));
    }

    @Test
    void testRegister_asManager_shouldReturn201_andUserAndManagerArePersisted() {
        var request = TestDataBuilder.createValidRegisterRequest();


        HttpEntity<RegisterRequest> requestEntity = new HttpEntity<>(request, createAuthHeaders(adminUser));
        ResponseEntity<String> response = restTemplate.exchange(
                "/auth/register?manager=true",
                HttpMethod.POST,
                requestEntity,
                String.class
        );

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        ApiResponse<RegisterResponse> apiResponse = parseApiResponse(response, RegisterResponse.class);
        assertNotNull(apiResponse);
        assertTrue(apiResponse.isSuccess());

        Optional<User> savedUserOpt = userRepository.findByEmail("john.doe@example.com");
        assertTrue(savedUserOpt.isPresent());
        User savedUser = savedUserOpt.get();
        assertEquals("John", savedUser.getFirstName());
        assertEquals("Doe", savedUser.getLastName());
        assertEquals("john.doe@example.com", savedUser.getEmail());
        assertNotNull(savedUser.getPasswordHash());
        assertNotEquals("securePassword123", savedUser.getPasswordHash());
        assertTrue(passwordEncoder.matches("securePassword123", savedUser.getPasswordHash()));

        assertTrue(managerRepository.existsByUserId(savedUser.getId()));
    }


    @Test
    void testLogin_shouldReturn200_withValidCredentials() {
        var user = TestDataBuilder.createUserComplete();
        user.setPasswordHash(passwordEncoder.encode("securePassword123"));
        userRepository.save(user);


        LoginRequest request = new LoginRequest("test@example.com", "securePassword123");

        ResponseEntity<ApiResponse<LoginResponse>> response = restTemplate.exchange(
                getApiUrl("/auth/login"),
                HttpMethod.POST,
                new HttpEntity<>(request),
                new ParameterizedTypeReference<>() {
                }
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().isSuccess());
        assertNotNull(response.getBody().getData().getToken());
        assertNotNull(response.getBody().getData().getRefreshToken(), "El refresh token debe estar presente");
    }

    @Test
    void testLogin_shouldFail_withInvalidPassword() {
        userRepository.save(TestDataBuilder.createUserComplete());

        LoginRequest request = new LoginRequest("john.doe@example.com", "wrongPassword");

        ResponseEntity<ApiResponse<Void>> response = restTemplate.exchange(
                getApiUrl("/auth/login"),
                HttpMethod.POST,
                new HttpEntity<>(request),
                new ParameterizedTypeReference<>() {
                }
        );

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertFalse(response.getBody().isSuccess());
        assertTrue(response.getBody().getMessage().contains("Invalid credentials"));
    }

    @Test
    void testLogin_shouldFail_withNonExistentUser() {
        LoginRequest request = new LoginRequest("nonexistent@example.com", "somePassword");

        ResponseEntity<ApiResponse<Void>> response = restTemplate.exchange(
                getApiUrl("/auth/login"),
                HttpMethod.POST,
                new HttpEntity<>(request),
                new ParameterizedTypeReference<>() {
                }
        );

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertFalse(response.getBody().isSuccess());
        assertTrue(response.getBody().getMessage().contains("Invalid credentials"));
    }

    @ParameterizedTest
    @CsvSource({
            "invalid-email, password123, email",
            "'', password123, email",
            "test@example.com, '', password"
    })
    void testRegister_withInvalidInput_shouldReturn400(String email, String password, String expectedField) {
        RegisterRequest request = new RegisterRequest();
        request.setEmail(email);
        request.setPassword(password);

        HttpEntity<RegisterRequest> requestEntity = new HttpEntity<>(request);
        ResponseEntity<String> response = restTemplate.exchange(
                "/auth/register",
                HttpMethod.POST,
                requestEntity,
                String.class
        );

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        ApiResponse<Void> apiResponse = parseApiResponse(response, Void.class);
        assertNotNull(apiResponse);
        assertTrue(apiResponse.getMessage().contains(expectedField));
        assertTrue(apiResponse.getMessage().contains("es obligatorio") || apiResponse.getMessage().contains("is not an alphanumeric value"));
    }
}