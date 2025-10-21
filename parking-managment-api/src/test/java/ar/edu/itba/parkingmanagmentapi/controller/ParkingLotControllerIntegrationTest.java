package ar.edu.itba.parkingmanagmentapi.controller;

import ar.edu.itba.parkingmanagmentapi.BaseIntegrationTest;
import ar.edu.itba.parkingmanagmentapi.dto.ApiResponse;
import ar.edu.itba.parkingmanagmentapi.dto.ParkingLotRequest;
import ar.edu.itba.parkingmanagmentapi.dto.ParkingLotResponse;
import ar.edu.itba.parkingmanagmentapi.dto.SpotRequest;
import ar.edu.itba.parkingmanagmentapi.dto.enums.VehicleType;
import ar.edu.itba.parkingmanagmentapi.model.Manager;
import ar.edu.itba.parkingmanagmentapi.model.ParkingLot;
import ar.edu.itba.parkingmanagmentapi.model.User;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

class ParkingLotControllerIntegrationTest extends BaseIntegrationTest {

    @Test
    void testCreateParkingLot_shouldReturn201_andParkingLotIsPersisted() {
        // Arrange
        ParkingLotRequest request = new ParkingLotRequest();
        request.setName("Estacionamiento Central");
        request.setAddress("Av. Siempre Viva 123");
        request.setImageUrl("http://example.com/image.jpg");
        request.setLatitude(-34.6037);
        request.setLongitude(-58.3816);
        request.setSpots(List.of(SpotRequest.builder()
                .vehicleType(VehicleType.MOTORCYCLE.getName())
                .code("A")
                .floor(1)
                .build()));

        HttpEntity<ParkingLotRequest> requestEntity = new HttpEntity<>(request, createAuthHeaders(managerUser));

        // Act
        ResponseEntity<ApiResponse<ParkingLotResponse>> response = restTemplate.exchange(
                "/parking-lots",
                HttpMethod.POST,
                requestEntity,
                new ParameterizedTypeReference<>() {
                }
        );

        // Assert
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertNotNull(response.getBody().getData());
        assertEquals("Estacionamiento Central", response.getBody().getData().getName());
        assertEquals("Av. Siempre Viva 123", response.getBody().getData().getAddress());

        Optional<ParkingLot> savedLot = parkingLotRepository.findById(response.getBody().getData().getId());
        assertTrue(savedLot.isPresent());
        assertEquals("Estacionamiento Central", savedLot.get().getName());
        assertEquals("http://example.com/image.jpg", savedLot.get().getImageUrl());
    }

    @Test
    void testGetParkingLotById_shouldReturn200_andParkingLotData() {
        ParkingLot parkingLot = new ParkingLot();
        parkingLot.setName("Estacionamiento Norte");
        parkingLot.setAddress("Calle Falsa 456");
        parkingLot.setImageUrl("http://example.com/image2.jpg");
        parkingLot.setLatitude(-34.6037);
        parkingLot.setLongitude(-58.3816);
        parkingLotRepository.save(parkingLot);

        HttpEntity<Void> requestEntity = new HttpEntity<>(createAuthHeaders(managerUser));

        ResponseEntity<ApiResponse<ParkingLotResponse>> response = restTemplate.exchange(
                "/parking-lots/" + parkingLot.getId(),
                HttpMethod.GET,
                requestEntity,
                new ParameterizedTypeReference<>() {
                }
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertNotNull(response.getBody().getData());
        assertEquals("Estacionamiento Norte", response.getBody().getData().getName());
    }

    @Test
    void testGetParkingLotById_shouldReturn404_whenNotFound() {
        HttpEntity<Void> requestEntity = new HttpEntity<>(createAuthHeaders(managerUser));
        ResponseEntity<String> response = restTemplate.exchange(
                "/parking-lots/99999",
                HttpMethod.GET,
                requestEntity,
                String.class
        );

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void testGetAllParkingLots_shouldReturn200_andListOfParkingLots() {
        ParkingLot p1 = new ParkingLot();
        p1.setName("Uno");
        p1.setAddress("Calle 1");
        p1.setImageUrl("url1");
        p1.setLatitude(-34.6037);
        p1.setLongitude(-58.3816);

        ParkingLot p2 = new ParkingLot();
        p2.setName("Dos");
        p2.setAddress("Calle 2");
        p2.setImageUrl("url2");
        p2.setLatitude(-34.6037);
        p2.setLongitude(-58.3816);

        parkingLotRepository.saveAll(List.of(p1, p2));

        HttpEntity<Void> requestEntity = new HttpEntity<>(createAuthHeaders(managerUser));
        ResponseEntity<ApiResponse<List<ParkingLotResponse>>> response = restTemplate.exchange(
                "/parking-lots",
                HttpMethod.GET,
                requestEntity,
                new ParameterizedTypeReference<>() {
                }
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertNotNull(response.getBody().getData());
        assertTrue(response.getBody().getData().size() >= 2);
    }

    @Test
    void testUpdateParkingLot_shouldReturn200_andUpdateFields() {
        ParkingLotRequest updateRequest = new ParkingLotRequest();
        updateRequest.setName("Nuevo Nombre");
        updateRequest.setAddress("Nueva Direccion");
        updateRequest.setImageUrl("nuevo.jpg");
        updateRequest.setLatitude(-34.6037);
        updateRequest.setLongitude(-58.3816);

        HttpEntity<ParkingLotRequest> requestEntity = new HttpEntity<>(updateRequest, createAuthHeaders(managerUser));
        ResponseEntity<ApiResponse<ParkingLotResponse>> response = restTemplate.exchange(
                "/parking-lots/" + existingParkingLot.getId(),
                HttpMethod.PUT,
                requestEntity,
                new ParameterizedTypeReference<>() {
                }
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Nuevo Nombre", response.getBody().getData().getName());
        assertEquals("Nueva Direccion", response.getBody().getData().getAddress());
    }

    @ParameterizedTest
    @CsvSource({
            "'Av. Corrientes 1234 @@@'",
            "'Calle falsa #123!!'",
            "'***Direccion Mala***'",
            "'<>Direccion<>'"
    })
    void testCreateParkingLot_withMalformedAddress_shouldReturn400(String address) {
        ParkingLotRequest request = new ParkingLotRequest();
        request.setName("Parking Central");
        request.setAddress(address);

        HttpEntity<ParkingLotRequest> requestEntity =
                new HttpEntity<>(request, createAuthHeaders(managerUser));

        ResponseEntity<String> response = restTemplate.exchange(
                "/parking-lots",
                HttpMethod.POST,
                requestEntity,
                String.class
        );

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        ApiResponse<ApiResponse> apiResponse = parseApiResponse(response, ApiResponse.class);
        assertNotNull(apiResponse);
        assertTrue(apiResponse.getMessage().contains("is not an alphanumeric value"));
    }

    @ParameterizedTest
    @CsvSource({
            ", Estacionamiento Centro, -34.6037, -58.3816",
            "Av. Corrientes 1234, , -34.6037, -58.3816",
            "Av. Corrientes 1234, Estacionamiento Centro, , -58.3816",
            "Av. Corrientes 1234, Estacionamiento Centro, -34.6037, "
    })
    void testCreateParkingLot_withMissingMandatoryFields_shouldReturn400(
            String address,
            String name,
            Double latitude,
            Double longitude
    ) {
        ParkingLotRequest request = new ParkingLotRequest();
        request.setAddress(address);
        request.setName(name);
        request.setImageUrl("http://example.com/parking.jpg");
        request.setLatitude(latitude);
        request.setLongitude(longitude);

        HttpEntity<ParkingLotRequest> requestEntity =
                new HttpEntity<>(request, createAuthHeaders(managerUser));

        ResponseEntity<String> response = restTemplate.exchange(
                "/parking-lots",
                HttpMethod.POST,
                requestEntity,
                String.class
        );

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());

        ApiResponse<ApiResponse> apiResponse = parseApiResponse(response, ApiResponse.class);
        assertNotNull(apiResponse);
        assertTrue(apiResponse.getMessage().contains("validation.field.mandatory"));
    }

    @Test
    void testDeleteParkingLot_shouldSucceed_whenManagerOwnsIt() {
        HttpEntity<Void> requestEntity = new HttpEntity<>(createAuthHeaders(managerUser));

        ResponseEntity<String> response = restTemplate.exchange(
                "/parking-lots/" + existingParkingLot.getId(),
                HttpMethod.DELETE,
                requestEntity,
                String.class
        );

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        assertFalse(parkingLotRepository.existsById(existingParkingLot.getId()), "ParkingLot should be deleted");
    }

    @Test
    void testDeleteParkingLot_shouldReturn403_whenManagerDoesNotOwnIt() {
        User otherManagerUserEntity = createTestUser("other.manager@test.com", "password123");
        Manager otherManager = managerRepository.save(new Manager(otherManagerUserEntity));

        ParkingLot parkingLot = new ParkingLot();
        parkingLot.setName("Other Manager Parking");
        parkingLot.setAddress("Other Street 456");
        parkingLot.setLatitude(-34.6037);
        parkingLot.setLongitude(-58.3816);
        parkingLot.setManager(otherManager);
        parkingLot = parkingLotRepository.save(parkingLot);

        HttpEntity<Void> requestEntity = new HttpEntity<>(createAuthHeaders(managerUser));

        ResponseEntity<String> response = restTemplate.exchange(
                "/parking-lots/" + parkingLot.getId(),
                HttpMethod.DELETE,
                requestEntity,
                String.class
        );

        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
        assertTrue(parkingLotRepository.existsById(parkingLot.getId()), "ParkingLot should still exist");
    }


}
