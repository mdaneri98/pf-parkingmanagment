package ar.edu.itba.parkingmanagmentapi.controller;

import ar.edu.itba.parkingmanagmentapi.BaseIntegrationTest;
import ar.edu.itba.parkingmanagmentapi.dto.ApiResponse;
import ar.edu.itba.parkingmanagmentapi.dto.SpotRequest;
import ar.edu.itba.parkingmanagmentapi.dto.SpotResponse;
import ar.edu.itba.parkingmanagmentapi.dto.VehicleType;
import ar.edu.itba.parkingmanagmentapi.model.Spot;
import org.junit.jupiter.api.Test;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

class SpotControllerIntegrationTest extends BaseIntegrationTest {

    @Test
    void testCreateSpot_shouldReturn201_andSpotIsPersisted() {
        SpotRequest request = new SpotRequest();
        request.setVehicleType(VehicleType.CAR.getName());
        request.setCode("A");
        request.setFloor(1);
        request.setParkingLotId(existingParkingLot.getId());

        HttpEntity<SpotRequest> requestEntity = new HttpEntity<>(request, createAuthHeaders(managerUser));
        ResponseEntity<ApiResponse<SpotResponse>> response = restTemplate.exchange(
                "/spots", HttpMethod.POST, requestEntity, new ParameterizedTypeReference<>() {
                });

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        SpotResponse body = response.getBody().getData();
        assertEquals("A", body.getCode());
        assertEquals("auto", body.getVehicleType());

        Optional<Spot> savedSpot = spotRepository.findAll().stream().findFirst();
        assertTrue(savedSpot.isPresent(), "El spot debería estar en la base de datos");
        assertEquals("A", savedSpot.get().getCode());
        assertEquals(VehicleType.CAR.getName(), savedSpot.get().getVehicleType());
        assertEquals(1, savedSpot.get().getFloor());
        assertTrue(savedSpot.get().getIsAvailable());
        assertEquals(existingParkingLot.getId(), savedSpot.get().getParkingLot().getId());
    }

    @Test
    void testGetSpotById_shouldReturn200_andCorrectSpot() {
        Spot spot = new Spot();
        spot.setCode("B2");
        spot.setVehicleType("MOTO");
        spot.setFloor(2);
        spot.setIsAvailable(true);
        spot.setParkingLot(existingParkingLot);
        spot = spotRepository.save(spot);

        HttpEntity<Void> requestEntity = new HttpEntity<>(createAuthHeaders(managerUser));

        ResponseEntity<ApiResponse<SpotResponse>> response = restTemplate.exchange(
                "/spots/" + spot.getId(), HttpMethod.GET, requestEntity,
                new ParameterizedTypeReference<>() {
                });

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        SpotResponse body = response.getBody().getData();
        assertEquals("B2", body.getCode());
    }

    @Test
    void testUpdateSpot_shouldReturn200_andSpotIsUpdated() {
        Spot spot = new Spot();
        spot.setCode("C3");
        spot.setVehicleType("auto");
        spot.setFloor(3);
        spot.setIsAvailable(true);
        spot.setParkingLot(existingParkingLot);
        spot = spotRepository.save(spot);

        SpotRequest updateRequest = new SpotRequest();
        updateRequest.setCode("C4");
        updateRequest.setVehicleType(VehicleType.MOTORCYCLE.getName());
        updateRequest.setFloor(3);
        updateRequest.setIsAvailable(false);
        updateRequest.setParkingLotId(existingParkingLot.getId());

        HttpEntity<SpotRequest> requestEntity = new HttpEntity<>(updateRequest, createAuthHeaders(managerUser));
        ResponseEntity<ApiResponse<SpotResponse>> response = restTemplate.exchange(
                "/spots/" + spot.getId(), HttpMethod.PUT, requestEntity,
                new ParameterizedTypeReference<>() {
                });

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        SpotResponse body = response.getBody().getData();
        assertEquals("C4", body.getCode());
        assertFalse(body.getIsAvailable());

        Spot updatedSpot = spotRepository.findById(spot.getId()).orElseThrow();
        assertEquals("C4", updatedSpot.getCode());
    }

    @Test
    void testDeleteSpot_shouldReturn204_andSpotIsRemoved() {
        Spot spot = new Spot();
        spot.setCode("D4");
        spot.setVehicleType("auto");
        spot.setFloor(4);
        spot.setIsAvailable(true);
        spot.setParkingLot(existingParkingLot);
        spot = spotRepository.save(spot);

        HttpEntity<Void> requestEntity = new HttpEntity<>(createAuthHeaders(managerUser));

        ResponseEntity<Void> response = restTemplate.exchange(
                "/spots/" + spot.getId(), HttpMethod.DELETE, requestEntity, Void.class);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        assertFalse(spotRepository.existsById(spot.getId()), "El spot debería haber sido eliminado");
    }
}
