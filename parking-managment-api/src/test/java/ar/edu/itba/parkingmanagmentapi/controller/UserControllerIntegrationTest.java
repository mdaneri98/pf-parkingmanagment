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

class UserControllerIntegrationTest extends BaseIntegrationTest {

    @Test
    void testCreateUser_shouldReturn201_andUserIsPersisted() {
        CreateUserRequest request = new CreateUserRequest();
        request.setFirstName("John");
        request.setLastName("Doe");
        request.setEmail("test@example.com");
        request.setPassword("securePassword123");

        HttpEntity<CreateUserRequest> requestEntity = new HttpEntity<>(request, createAuthHeaders(adminUser));
        ResponseEntity<ApiResponse<UserResponse>> response = restTemplate.exchange(
                "/users",
                HttpMethod.POST,
                requestEntity,
                new ParameterizedTypeReference<>() {
                }
        );

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("test@example.com", response.getBody().getData().getEmail());

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
        ResponseEntity<ApiResponse<UserResponse>> response = restTemplate.exchange(
                "/users",
                HttpMethod.POST,
                requestEntity,
                new ParameterizedTypeReference<>() {
                }
        );

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().getMessage().contains("ya está en uso"));
    }

    @ParameterizedTest
    @CsvSource({
            ", password123, validation.field.mandatory",
            "'', password123, email",
            "test@example.com, , validation.field.mandatory",
            "test@example.com, '', password"
    })
    void testCreateUser_withInvalidInput_shouldReturn400(String email, String password, String expectedField) {
        CreateUserRequest request = new CreateUserRequest();
        request.setEmail(email);
        request.setPassword(password);

        HttpEntity<CreateUserRequest> requestEntity = new HttpEntity<>(request, createAuthHeaders(adminUser));
        ResponseEntity<ApiResponse<UserResponse>> response = restTemplate.exchange(
                "/users",
                HttpMethod.POST,
                requestEntity,
                new ParameterizedTypeReference<>() {
                }
        );

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().getMessage().contains(expectedField));
    }

    @ParameterizedTest
    @CsvSource({
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
        ResponseEntity<ApiResponse<UserResponse>> response = restTemplate.exchange(
                "/users",
                HttpMethod.POST,
                requestEntity,
                new ParameterizedTypeReference<>() {
                }
        );

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().getMessage().toLowerCase().contains("is not an alphanumeric value"));
    }

    @Test
    void testGetUser_shouldReturn200_andCorrectUser() {
        User user = TestDataBuilder.createUserComplete();
        User savedUser = userRepository.save(user);
        Long userId = savedUser.getId();

        HttpEntity<Void> requestEntity = new HttpEntity<>(createAuthHeaders(adminUser));
        ResponseEntity<ApiResponse<UserResponse>> getResponse = restTemplate.exchange(
                "/users/" + userId,
                HttpMethod.GET,
                requestEntity,
                new ParameterizedTypeReference<>() {
                }
        );

        assertEquals(HttpStatus.OK, getResponse.getStatusCode());
        assertNotNull(getResponse.getBody());
        UserResponse userResponse = getResponse.getBody().getData();
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
        ResponseEntity<ApiResponse<Void>> response = restTemplate.exchange(
                "/users/" + nonExistentId,
                HttpMethod.GET,
                requestEntity,
                new ParameterizedTypeReference<>() {
                }
        );

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().getMessage().toLowerCase().contains("user.not.found"));
    }

    @Test
    void testUpdateUser_shouldModifyFields_andPersistChanges() {
        UpdateUserRequest updateRequest = new UpdateUserRequest();
        updateRequest.setFirstName("NuevoNombre");
        updateRequest.setLastName("NuevoApellido");
        updateRequest.setImageUrl("https://example.com/image2.jpg");
        updateRequest.setUserDetail(new UserDetailDTO("1234567890", "New Address", "en"));


        HttpEntity<UpdateUserRequest> requestEntity = new HttpEntity<>(updateRequest, createAuthHeaders(normalUser));
        ResponseEntity<ApiResponse<UserResponse>> updateResponse = restTemplate.exchange(
                "/users/" + normalUser.getId(),
                HttpMethod.PUT,
                requestEntity,
                new ParameterizedTypeReference<>() {
                }
        );

        assertEquals(HttpStatus.OK, updateResponse.getStatusCode());
        assertNotNull(updateResponse.getBody());
        assertEquals(updateRequest.getFirstName(), updateResponse.getBody().getData().getFirstName());

        Optional<User> updatedUserOpt = userRepository.findById(normalUser.getId());
        assertTrue(updatedUserOpt.isPresent());
        User updatedUser = updatedUserOpt.get();
        assertEquals(updateRequest.getFirstName(), updatedUser.getFirstName());
        assertEquals(updateRequest.getLastName(), updatedUser.getLastName());
        assertEquals(updateRequest.getImageUrl(), updatedUser.getImageUrl());
    }
}

