package ar.edu.itba.parkingmanagmentapi.controller;

import ar.edu.itba.parkingmanagmentapi.BaseIntegrationTest;
import ar.edu.itba.parkingmanagmentapi.dto.ApiResponse;
import ar.edu.itba.parkingmanagmentapi.dto.CreateUserRequest;
import ar.edu.itba.parkingmanagmentapi.dto.UserResponse;
import ar.edu.itba.parkingmanagmentapi.model.User;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;


class UserControllerIntegrationTest extends BaseIntegrationTest {

    @Test
    void testCreateUser_shouldReturn201_andUserIsPersisted() {
        CreateUserRequest request = new CreateUserRequest();
        request.setEmail("test@example.com");
        request.setPassword("securePassword123");

        ResponseEntity<UserResponse> response = restTemplate.postForEntity("/users", request, UserResponse.class);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("test@example.com", response.getBody().getEmail());

        Optional<User> savedUserOpt = userRepository.findByEmail("test@example.com");
        assertTrue(savedUserOpt.isPresent(), "El usuario debería estar en la base de datos");
        User savedUser = savedUserOpt.get();
        assertNotNull(savedUser.getPasswordHash());
        assertNotEquals("securePassword123", savedUser.getPasswordHash(), "La contraseña no debe guardarse en texto plano");
    }

    @Test
    void testCreateUser_whenEmailAlreadyExists_shouldReturn400() {
        String email = "test@example.com";
        User existingUser = new User();
        existingUser.setEmail(email);
        existingUser.setPasswordHash("hashedpassword");
        userRepository.save(existingUser);

        CreateUserRequest request = new CreateUserRequest();
        request.setEmail(email);
        request.setPassword("anotherPassword");

        ResponseEntity<ApiResponse> response = restTemplate.postForEntity("/users", request, ApiResponse.class);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        ApiResponse error = response.getBody();
        assertNotNull(error);
        assertEquals("The email test@example.com is already in use", error.getMessage());
    }

    @ParameterizedTest
    @CsvSource({
            ", password123, email",              // email null
            "'', password123, email",           // email vacío
            "test@example.com, , password",     // password null
            "test@example.com, '', password"    // password vacío
    })
    void testCreateUser_withInvalidInput_shouldReturn400(String email, String password, String expectedField) {
        CreateUserRequest request = new CreateUserRequest();
        request.setEmail(email);
        request.setPassword(password);

        ResponseEntity<ApiResponse> response = restTemplate.postForEntity("/users", request, ApiResponse.class);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        ApiResponse error = response.getBody();
        assertNotNull(error);
        assertTrue(error.getMessage().contains(expectedField));
        assertTrue(error.getMessage().contains("is mandatory"));
    }


    @ParameterizedTest
    @CsvSource({
            // Emails con formato inválido
            "plainaddress, validPassword123",
            "'@no-local.com', validPassword123",
            "'missingatsign.com', validPassword123",
            "'missing.domain@.com', validPassword123",
            "'email@111.222.333.44444', validPassword123",
            "'two@@signs.com', validPassword123",
            "'Outlook Contact <outlook-contact@domain.com>', validPassword123"
    })
    void testCreateUser_withMalformedEmail_shouldReturn400(String email, String password) {
        CreateUserRequest request = new CreateUserRequest();
        request.setEmail(email);
        request.setPassword(password);

        ResponseEntity<ApiResponse> response = restTemplate.postForEntity("/users", request, ApiResponse.class);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        ApiResponse error = response.getBody();
        assertNotNull(error);
        assertTrue(error.getMessage().contains("is not an alphanumeric value"));
    }


}
