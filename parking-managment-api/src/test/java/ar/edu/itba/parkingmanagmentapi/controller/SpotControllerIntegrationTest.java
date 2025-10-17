package ar.edu.itba.parkingmanagmentapi.controller;

import ar.edu.itba.parkingmanagmentapi.BaseIntegrationTest;
import ar.edu.itba.parkingmanagmentapi.dto.ApiResponse;
import ar.edu.itba.parkingmanagmentapi.dto.PageResponse;
import ar.edu.itba.parkingmanagmentapi.dto.SpotRequest;
import ar.edu.itba.parkingmanagmentapi.dto.SpotResponse;
import ar.edu.itba.parkingmanagmentapi.dto.enums.VehicleType;
import ar.edu.itba.parkingmanagmentapi.model.ParkingLot;
import ar.edu.itba.parkingmanagmentapi.model.Spot;
import org.junit.jupiter.api.Test;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

class SpotControllerIntegrationTest extends BaseIntegrationTest {

    @Test
    void testCreateSpot_shouldReturn201_andSpotIsPersisted() {
        SpotRequest request = new SpotRequest();
        request.setVehicleType(VehicleType.CAR.getName());
        request.setCode("A");
        request.setFloor(1);
        request.setIsReservable(false);
        request.setIsAccessible(false);

        HttpEntity<SpotRequest> requestEntity = new HttpEntity<>(request, createAuthHeaders(managerUser));
        ResponseEntity<ApiResponse<SpotResponse>> response = restTemplate.exchange(
                "/parking-lots/" + existingParkingLot.getId() + "/spots", HttpMethod.POST, requestEntity, new ParameterizedTypeReference<>() {
                });

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        SpotResponse body = response.getBody().getData();
        assertEquals("A", body.getCode());
        assertEquals("auto", body.getVehicleType());

        Optional<Spot> savedSpot = spotRepository.findById(body.getId());
        assertTrue(savedSpot.isPresent(), "El spot debería estar en la base de datos");
        assertEquals("A", savedSpot.get().getCode());
        assertEquals(VehicleType.CAR.getName(), savedSpot.get().getVehicleType());
        assertEquals(1, savedSpot.get().getFloor());
        assertTrue(savedSpot.get().getIsAvailable());
        assertFalse(savedSpot.get().getIsReservable());
        assertFalse(savedSpot.get().getIsAccessible());
        assertEquals(existingParkingLot.getId(), savedSpot.get().getParkingLot().getId());
    }

    @Test
    void testGetSpotById_shouldReturn200_andCorrectSpot() {
        Spot spot = existingSpot;

        HttpEntity<Void> requestEntity = new HttpEntity<>(createAuthHeaders(managerUser));

        ResponseEntity<ApiResponse<SpotResponse>> response = restTemplate.exchange(
                "/parking-lots/" + existingParkingLot.getId() + "/spots/" + spot.getId(), HttpMethod.GET, requestEntity,
                new ParameterizedTypeReference<>() {
                });

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        SpotResponse body = response.getBody().getData();
        assertEquals("SPOT1", body.getCode());
    }

    @Test
    void testUpdateSpot_shouldReturn200_andSpotIsUpdated() {
        Spot spot = existingSpot;

        SpotRequest updateRequest = new SpotRequest();
        updateRequest.setCode("C4");
        updateRequest.setVehicleType(VehicleType.MOTORCYCLE.getName());
        updateRequest.setFloor(3);
        updateRequest.setIsReservable(true);

        HttpEntity<SpotRequest> requestEntity = new HttpEntity<>(updateRequest, createAuthHeaders(managerUser));
        ResponseEntity<ApiResponse<SpotResponse>> response = restTemplate.exchange(
                "/parking-lots/" + existingParkingLot.getId() + "/spots/" + spot.getId(), HttpMethod.PUT, requestEntity,
                new ParameterizedTypeReference<>() {
                });

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        SpotResponse body = response.getBody().getData();
        assertEquals("C4", body.getCode());
        assertTrue(body.getIsAvailable());
        assertTrue(body.getIsReservable());

        Spot updatedSpot = spotRepository.findById(spot.getId()).orElseThrow();
        assertEquals("C4", updatedSpot.getCode());
    }

    @Test
    void testDeleteSpot_shouldReturn204_andSpotIsRemoved() {
        Spot spot = existingSpot;

        HttpEntity<Void> requestEntity = new HttpEntity<>(createAuthHeaders(managerUser));

        ResponseEntity<Void> response = restTemplate.exchange(
                "/parking-lots/" + existingParkingLot.getId() + "/spots/" + spot.getId(), HttpMethod.DELETE, requestEntity, Void.class);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        assertFalse(spotRepository.existsById(spot.getId()), "El spot debería haber sido eliminado");
    }


    @Test
    void testGetSpots_shouldReturnPagedResults() {
        ParkingLot parkingLot = existingParkingLot;

        Spot spot1 = new Spot("A", true, "CAR", 1, parkingLot);   // disponible
        Spot spot2 = new Spot("B", false, "CAR", 1, parkingLot);  // no disponible
        Spot spot3 = new Spot("B", true, "MOTORCYCLE", 2, parkingLot); // moto

        spotRepository.saveAll(List.of(spot1, spot2, spot3));

        HttpEntity<Void> requestEntity =
                new HttpEntity<>(createAuthHeaders(managerUser));


        ResponseEntity<ApiResponse<PageResponse<SpotResponse>>> response = restTemplate.exchange(
                "/parking-lots/" + parkingLot.getId() + "/spots",
                HttpMethod.GET,
                requestEntity,
                new ParameterizedTypeReference<>() {
                }
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());

        PageResponse<SpotResponse> page = response.getBody().getData();

        assertEquals(0, page.getPageNumber());             // Página actual (0-based)
        assertEquals(1, page.getTotalPages());         // 3 spots en 1 page
        assertEquals(5, page.getTotalElements());      // Total de spots
        assertTrue(page.getContent().stream().anyMatch(s -> s.getCode().equals("A")));
        assertTrue(page.getContent().stream().anyMatch(s -> s.getCode().equals("A")));
    }

    @Test
    void testGetSpots_withFilters_shouldReturnFilteredResults() {
        ParkingLot parkingLot = existingParkingLot;

        Spot spot1 = new Spot("A", true, "CAR", 1, parkingLot);   // disponible
        Spot spot2 = new Spot("B", false, "CAR", 1, parkingLot);  // no disponible
        Spot spot3 = new Spot("B", false, "MOTORCYCLE", 2, parkingLot); // no disponible
        spotRepository.saveAll(List.of(spot1, spot2, spot3));

        HttpEntity<Void> requestEntity = new HttpEntity<>(createAuthHeaders(managerUser));

        ResponseEntity<ApiResponse<PageResponse<SpotResponse>>> response = restTemplate.exchange(
                "/parking-lots/" + parkingLot.getId() + "/spots?available=true",
                HttpMethod.GET,
                requestEntity,
                new ParameterizedTypeReference<>() {
                }
        );

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());

        PageResponse<SpotResponse> page = response.getBody().getData();
        assertEquals(3, page.getTotalElements());
        assertEquals(3, page.getContent().size());
        assertTrue(page.getContent().stream().allMatch(SpotResponse::getIsAvailable));
    }

}
