package ar.edu.itba.parkingmanagmentapi.controller;

import ar.edu.itba.parkingmanagmentapi.BaseIntegrationTest;
import ar.edu.itba.parkingmanagmentapi.builder.TestDataBuilder;
import ar.edu.itba.parkingmanagmentapi.dto.ApiResponse;
import ar.edu.itba.parkingmanagmentapi.dto.CreateUserRequest;
import ar.edu.itba.parkingmanagmentapi.dto.UpdateUserRequest;
import ar.edu.itba.parkingmanagmentapi.dto.UserResponse;
import ar.edu.itba.parkingmanagmentapi.model.User;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

class UserControllerIntegrationTest extends BaseIntegrationTest {

    @Test
    void testCreateUser_shouldReturn201_andUserIsPersisted() {
        CreateUserRequest request = new CreateUserRequest();
        request.setFirstName("John");
        request.setLastName("Doe");
        request.setEmail("test@example.com");
        request.setPassword("securePassword123");

        HttpEntity<CreateUserRequest> requestEntity = new HttpEntity<>(request, createAuthHeaders(adminUser));
        ResponseEntity<UserResponse> response = restTemplate.exchange("/users", HttpMethod.POST, requestEntity, UserResponse.class);

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
        CreateUserRequest request = new CreateUserRequest();
        request.setFirstName("John");
        request.setLastName("Doe");
        request.setEmail(this.normalUser.getEmail());
        request.setPassword("anotherPassword");

        HttpEntity<CreateUserRequest> requestEntity = new HttpEntity<>(request, createAuthHeaders(adminUser));
        ResponseEntity<String> response = restTemplate.exchange("/users", HttpMethod.POST, requestEntity, String.class);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        ApiResponse<UserResponse> apiResponse = parseApiResponse(response, UserResponse.class);
        assertNotNull(response);
        assertTrue(apiResponse.getMessage().contains("in use"));
    }

    @ParameterizedTest
    @CsvSource({
            ", password123, email",
            "'', password123, email",
            "test@example.com, , password",
            "test@example.com, '', password"
    })
    void testCreateUser_withInvalidInput_shouldReturn400(String email, String password, String expectedField) {
        CreateUserRequest request = new CreateUserRequest();
        request.setEmail(email);
        request.setPassword(password);

        HttpEntity<CreateUserRequest> requestEntity = new HttpEntity<>(request, createAuthHeaders(adminUser));
        ResponseEntity<String> response = restTemplate.exchange("/users", HttpMethod.POST, requestEntity, String.class);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        ApiResponse<UserResponse> apiResponse = parseApiResponse(response, UserResponse.class);
        assertNotNull(apiResponse);
        assertTrue(apiResponse.getMessage().contains(expectedField));
        assertTrue(apiResponse.getMessage().contains("is mandatory"));
    }


    @ParameterizedTest
    @CsvSource({
            // Emails con formato inválido
            "plainaddress, validPassword123",
            "'@no-local.com', validPassword123",
            "'missingatsign.com', validPassword123",
            "'missing.domain@.com', validPassword123",
            "'two@@signs.com', validPassword123",
            "'Outlook Contact <outlook-contact@domain.com>', validPassword123"
    })
    void testCreateUser_withMalformedEmail_shouldReturn400(String email, String password) {
        CreateUserRequest request = new CreateUserRequest();
        request.setEmail(email);
        request.setPassword(password);

        HttpEntity<CreateUserRequest> requestEntity = new HttpEntity<>(request, createAuthHeaders(adminUser));
        ResponseEntity<String> response = restTemplate.exchange("/users", HttpMethod.POST, requestEntity, String.class);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        ApiResponse<ApiResponse> apiResponse = parseApiResponse(response, ApiResponse.class);
        assertNotNull(apiResponse);
        assertTrue(apiResponse.getMessage().contains("is not an alphanumeric value"));
    }

    @Test
    void testGetUser_shouldReturn200_andCorrectUser() {
        User user = TestDataBuilder.createUserComplete();
        User savedUser = userRepository.save(user);
        Long userId = savedUser.getId();

        HttpEntity<Void> requestEntity = new HttpEntity<>(createAuthHeaders(adminUser));
        ResponseEntity<UserResponse> getResponse = restTemplate.exchange("/users/" + userId, HttpMethod.GET, requestEntity, UserResponse.class);
        assertEquals(HttpStatus.OK, getResponse.getStatusCode());

        UserResponse userResponse = getResponse.getBody();
        assertNotNull(userResponse);
        assertEquals(user.getEmail(), userResponse.getEmail());
        assertEquals(user.getFirstName(), userResponse.getFirstName());
        assertEquals(user.getLastName(), userResponse.getLastName());
        assertEquals(user.getImageUrl(), userResponse.getImageUrl());
        assertNotNull(userResponse.getUserDetail());
        assertEquals(user.getUserDetail().getPhone(), userResponse.getUserDetail().getPhone());
        assertEquals(user.getUserDetail().getAddress(), userResponse.getUserDetail().getAddress());
    }

    @Test
    void testGetUser_whenUserDoesNotExist_shouldReturn404() {
        long nonExistentId = 9999L;

        HttpEntity<Void> requestEntity = new HttpEntity<>(createAuthHeaders(adminUser));
        ResponseEntity<ApiResponse> response = restTemplate.exchange("/users/" + nonExistentId, HttpMethod.GET, requestEntity, ApiResponse.class);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        ApiResponse error = response.getBody();
        assertNotNull(error);
        assertTrue(error.getMessage().toLowerCase().contains("not found"));
    }

    @Test
    void testUpdateUser_shouldModifyFields_andPersistChanges() {
        User user = TestDataBuilder.createUserComplete();
        User savedUser = userRepository.save(user);
        Long userId = savedUser.getId();

        UpdateUserRequest updateRequest = new UpdateUserRequest();
        updateRequest.setFirstName("NuevoNombre");
        updateRequest.setLastName("NuevoApellido");
        updateRequest.setImageUrl("http://example.com/image2.jpg");

        HttpEntity<UpdateUserRequest> requestEntity = new HttpEntity<>(updateRequest, createAuthHeaders(adminUser));
        ResponseEntity<UserResponse> updateResponse = restTemplate.exchange("/users/" + userId, HttpMethod.PUT, requestEntity, UserResponse.class);

        assertEquals(HttpStatus.OK, updateResponse.getStatusCode());
        assertNotNull(updateResponse.getBody());
        assertEquals(updateRequest.getFirstName(), updateResponse.getBody().getFirstName());

        Optional<User> updatedUserOpt = userRepository.findById(userId);
        assertTrue(updatedUserOpt.isPresent());
        User updatedUser = updatedUserOpt.get();
        assertEquals(updateRequest.getFirstName(), updatedUser.getFirstName());
        assertEquals(updateRequest.getLastName(), updatedUser.getLastName());
        assertEquals(updateRequest.getImageUrl(), updatedUser.getImageUrl());
    }

    @Test
    void testUpdateUser_whenUserDoesNotExist_shouldReturn404() {
        long nonExistentId = 9999L;

        UpdateUserRequest request = new UpdateUserRequest();
        request.setFirstName("UpdatedName");

        HttpEntity<UpdateUserRequest> entity = new HttpEntity<>(request, createAuthHeaders(adminUser));

        ResponseEntity<ApiResponse> response = restTemplate.exchange("/users/" + nonExistentId, HttpMethod.PUT, entity, ApiResponse.class);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        ApiResponse error = response.getBody();
        assertNotNull(error);
        assertTrue(error.getMessage().toLowerCase().contains("not found"));
    }

}
