package ar.edu.itba.parkingmanagmentapi.controller;

import ar.edu.itba.parkingmanagmentapi.dto.CreateUserRequest;
import ar.edu.itba.parkingmanagmentapi.dto.UserResponse;
import ar.edu.itba.parkingmanagmentapi.model.User;
import ar.edu.itba.parkingmanagmentapi.repository.ManagerRepository;
import ar.edu.itba.parkingmanagmentapi.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class UserControllerIntegrationTest {

    @Autowired
    private TestRestTemplate restTemplate;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ManagerRepository managerRepository;

    @BeforeEach
    void cleanDb() {
        managerRepository.deleteAll();
        userRepository.deleteAll();
    }

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
        assertNotNull(savedUser.getPasswordHash(), "La contraseña debe estar hasheada");
        assertNotEquals("securePassword123", savedUser.getPasswordHash(), "La contraseña no debe guardarse en texto plano");
    }

    @Test
    void testCreateUser_whenEmailAlreadyExists_shouldReturn400() {
        String email = "duplicate@example.com";
        User existingUser = new User();
        existingUser.setEmail(email);
        existingUser.setPasswordHash("hashedpassword");
        userRepository.save(existingUser);

        CreateUserRequest request = new CreateUserRequest();
        request.setEmail(email);
        request.setPassword("anotherPassword");

        ResponseEntity<Void> response = restTemplate.postForEntity("/users", request, Void.class);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @ParameterizedTest
    @CsvSource({
            // Casos inválidos de email y/o password
            ", password123",                   // email null
            "'', password123",                 // email vacío
            "test@example.com, ",              // password null
            "test@example.com, ''",            // password vacío
    })
    void testCreateUser_withInvalidInput_shouldReturn400(String email, String password) {
        CreateUserRequest request = new CreateUserRequest();
        request.setEmail(email);
        request.setPassword(password);

        ResponseEntity<Void> response = restTemplate.postForEntity("/users", request, Void.class);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        //TODO: despues mirar que el mensaje de error sea el correcto
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

        ResponseEntity<Void> response = restTemplate.postForEntity("/users", request, Void.class);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }


}
