package ar.edu.itba.parkingmanagmentapi.controller;

import ar.edu.itba.parkingmanagmentapi.BaseIntegrationTest;
import ar.edu.itba.parkingmanagmentapi.dto.*;
import ar.edu.itba.parkingmanagmentapi.model.ParkingLot;
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
        request.setManagerId(managerUser.getId());
        request.setSpots(List.of(SpotDTO.builder()
                .vehicleType("car")
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

        ParkingLot p2 = new ParkingLot();
        p2.setName("Dos");
        p2.setAddress("Calle 2");
        p2.setImageUrl("url2");

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
        ParkingLot parkingLot = new ParkingLot();
        parkingLot.setName("Viejo Nombre");
        parkingLot.setAddress("Vieja Direccion");
        parkingLot.setImageUrl("viejo.jpg");
        parkingLotRepository.save(parkingLot);

        ParkingLotRequest updateRequest = new ParkingLotRequest();
        updateRequest.setName("Nuevo Nombre");
        updateRequest.setAddress("Nueva Direccion");
        updateRequest.setImageUrl("nuevo.jpg");

        HttpEntity<ParkingLotRequest> requestEntity = new HttpEntity<>(updateRequest, createAuthHeaders(managerUser));
        ResponseEntity<ApiResponse<ParkingLotResponse>> response = restTemplate.exchange(
                "/parking-lots/" + parkingLot.getId(),
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

    @Test
    void testUpdateParkingLot_shouldReturn404_whenNotFound() {
        UpdateParkingLotRequest request = new UpdateParkingLotRequest();
        request.setName("Nombre Inexistente");
        request.setAddress("Direccion Inexistente");
        request.setImageUrl("http://example.com/no-image.jpg");

        HttpEntity<UpdateParkingLotRequest> requestEntity = new HttpEntity<>(request, createAuthHeaders(managerUser));
        ResponseEntity<String> response = restTemplate.exchange(
                "/parking-lots/99999",
                HttpMethod.PUT,
                requestEntity,
                String.class
        );

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void testDeleteParkingLot_shouldReturn204_andRemoveEntity() {
        ParkingLot parkingLot = new ParkingLot();
        parkingLot.setName("Eliminar");
        parkingLot.setAddress("Calle X");
        parkingLot.setImageUrl("img.jpg");
        parkingLot = parkingLotRepository.save(parkingLot);

        HttpEntity<Void> requestEntity = new HttpEntity<>(createAuthHeaders(managerUser));
        ResponseEntity<ApiResponse<Void>> response = restTemplate.exchange(
                "/parking-lots/" + parkingLot.getId(),
                HttpMethod.DELETE,
                requestEntity,
                new ParameterizedTypeReference<>() {
                }
        );

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        assertFalse(parkingLotRepository.findById(parkingLot.getId()).isPresent());
    }

    @Test
    void testDeleteParkingLot_shouldReturn404_whenNotFound() {
        HttpEntity<Void> requestEntity = new HttpEntity<>(createAuthHeaders(adminUser));
        ResponseEntity<String> response = restTemplate.exchange(
                "/parking-lots/99999",
                HttpMethod.DELETE,
                requestEntity,
                String.class
        );

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @ParameterizedTest
    @CsvSource({
            "'Av. Corrientes 1234 @@@', 1",
            "'Calle falsa #123!!', 2",
            "'***Direccion Mala***', 3",
            "'<>Direccion<>', 4"
    })
    void testCreateParkingLot_withMalformedAddress_shouldReturn400(String address, Long managerId) {
        ParkingLotRequest request = new ParkingLotRequest();
        request.setName("Parking Central");
        request.setAddress(address);
        request.setManagerId(managerId);

        HttpEntity<ParkingLotRequest> requestEntity =
                new HttpEntity<>(request, createAuthHeaders(adminUser));

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
            ", Av. Corrientes 1234",
            "1, "
    })
    void testCreateParkingLot_withMissingMandatoryFields_shouldReturn400(Long managerId, String address) {
        ParkingLotRequest request = new ParkingLotRequest();
        request.setManagerId(managerId);
        request.setAddress(address);
        request.setName("Estacionamiento Centro");
        request.setImageUrl("http://example.com/parking.jpg");

        HttpEntity<ParkingLotRequest> requestEntity =
                new HttpEntity<>(request, createAuthHeaders(adminUser));

        ResponseEntity<String> response = restTemplate.exchange(
                "/parking-lots",
                HttpMethod.POST,
                requestEntity,
                String.class
        );

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());

        ApiResponse<ApiResponse> apiResponse = parseApiResponse(response, ApiResponse.class);
        assertNotNull(apiResponse);
        assertTrue(apiResponse.getMessage().contains("is mandatory"));

    }


}
