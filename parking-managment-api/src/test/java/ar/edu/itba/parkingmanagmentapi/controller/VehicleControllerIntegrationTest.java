package ar.edu.itba.parkingmanagmentapi.controller;

import ar.edu.itba.parkingmanagmentapi.BaseIntegrationTest;
import ar.edu.itba.parkingmanagmentapi.dto.ApiResponse;
import ar.edu.itba.parkingmanagmentapi.dto.VehicleRequest;
import ar.edu.itba.parkingmanagmentapi.dto.VehicleResponse;
import ar.edu.itba.parkingmanagmentapi.model.UserVehicleAssignment;
import ar.edu.itba.parkingmanagmentapi.model.UserVehicleAssignmentId;
import ar.edu.itba.parkingmanagmentapi.model.Vehicle;
import org.junit.jupiter.api.Test;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

class VehicleControllerIntegrationTest extends BaseIntegrationTest {

    @Test
    void testCreateVehicle_shouldReturn201_andVehicleIsPersisted() {
        VehicleRequest request = new VehicleRequest();
        request.setLicensePlate("ABC123");
        request.setBrand("Toyota");
        request.setModel("Corolla");
        request.setType("AUTO");
        request.setUserId(normalUser.getId());

        HttpEntity<VehicleRequest> requestEntity = new HttpEntity<>(request, createAuthHeaders(normalUser));

        // Act
        ResponseEntity<ApiResponse<VehicleResponse>> response = restTemplate.exchange(
                "/vehicles",
                HttpMethod.POST,
                requestEntity,
                new ParameterizedTypeReference<>() {
                }
        );

        // Assert
        assertEquals(HttpStatus.CREATED, response.getStatusCode(), "El status debería ser 201 CREATED");
        assertNotNull(response.getBody(), "La respuesta no debería ser null");
        VehicleResponse vehicleResponse = response.getBody().getData();
        assertEquals("ABC123", vehicleResponse.getLicensePlate());
        assertEquals("Toyota", vehicleResponse.getBrand());
        assertEquals("Corolla", vehicleResponse.getModel());
        assertEquals("AUTO", vehicleResponse.getType());

        Optional<Vehicle> savedVehicleOpt = vehicleRepository.findById(request.getLicensePlate());
        assertTrue(savedVehicleOpt.isPresent(), "El vehículo debería estar en la base de datos");
        Vehicle savedVehicle = savedVehicleOpt.get();
        assertEquals("Toyota", savedVehicle.getBrand());
        assertEquals("Corolla", savedVehicle.getModel());
        assertEquals("AUTO", savedVehicle.getType());
    }

    @Test
    void testGetVehicle_shouldReturn200_ifOwner() {
        Vehicle vehicle = new Vehicle("XYZ987", "Ford", "Focus", "Hatchback");
        UserVehicleAssignment assignment = new UserVehicleAssignment();
        assignment.setId(new UserVehicleAssignmentId(normalUser.getId(), vehicle.getLicensePlate()));
        assignment.setUser(normalUser.getUser());
        assignment.setVehicle(vehicle);
        vehicle.getUserAssignments().add(assignment);
        vehicleRepository.save(vehicle);

        ResponseEntity<ApiResponse<VehicleResponse>> response = restTemplate.exchange(
                "/vehicles/" + vehicle.getLicensePlate(),
                HttpMethod.GET,
                new HttpEntity<>(createAuthHeaders(normalUser)),
                new ParameterizedTypeReference<>() {
                }
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(vehicle.getLicensePlate(), response.getBody().getData().getLicensePlate());
    }

    @Test
    void testGetVehicle_shouldReturn403_ifNotOwner() {
        Vehicle vehicle = new Vehicle("MNO456", "Honda", "Civic", "Sedan");
        vehicleRepository.save(vehicle);

        ResponseEntity<ApiResponse<VehicleResponse>> response = restTemplate.exchange(
                "/vehicles/" + vehicle.getLicensePlate(),
                HttpMethod.GET,
                new HttpEntity<>(createAuthHeaders(adminUser)),
                new ParameterizedTypeReference<>() {
                }
        );

        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
    }

    @Test
    void testGetAllVehicles_shouldReturnOnlyUserVehicles() {
        Vehicle v1 = new Vehicle("AAA111", "Chevrolet", "Onix", "Hatchback");
        Vehicle v2 = new Vehicle("BBB222", "Volkswagen", "Golf", "Hatchback");
        vehicleRepository.saveAll(List.of(v1, v2));

        UserVehicleAssignment assignment = new UserVehicleAssignment();
        assignment.setId(new UserVehicleAssignmentId(normalUser.getId(), v1.getLicensePlate()));
        assignment.setUser(normalUser.getUser());
        assignment.setVehicle(v1);
        userVehicleAssignmentRepository.save(assignment);

        UserVehicleAssignment assignment2 = new UserVehicleAssignment();
        assignment2.setId(new UserVehicleAssignmentId(normalUser.getId(), v2.getLicensePlate()));
        assignment2.setUser(normalUser.getUser());
        assignment2.setVehicle(v2);
        userVehicleAssignmentRepository.save(assignment2);

        UserVehicleAssignment assignment3 = new UserVehicleAssignment();
        assignment3.setId(new UserVehicleAssignmentId(otherUser.getId(), v2.getLicensePlate()));
        assignment3.setUser(otherUser.getUser());
        assignment3.setVehicle(v2);
        userVehicleAssignmentRepository.save(assignment3);


        ResponseEntity<ApiResponse<List<VehicleResponse>>> response = restTemplate.exchange(
                "/users/" + normalUser.getId() + "/vehicles",
                HttpMethod.GET,
                new HttpEntity<>(createAuthHeaders(normalUser)),
                new ParameterizedTypeReference<>() {
                }
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());

        List<VehicleResponse> vehicles = response.getBody().getData();
        List<String> plates = vehicles.stream()
                .map(VehicleResponse::getLicensePlate)
                .toList();

        assertTrue(plates.containsAll(List.of("AAA111", "BBB222")),
                "La respuesta debe contener los vehículos del usuario: AAA111 y BBB222");
    }

    @Test
    void testDeleteVehicle_shouldReturn204_ifOwner() {
        Vehicle vehicle = new Vehicle("DEL999", "Renault", "Clio", "Hatchback");
        vehicleRepository.save(vehicle);
        UserVehicleAssignment assignment = new UserVehicleAssignment();
        assignment.setId(new UserVehicleAssignmentId(normalUser.getId(), vehicle.getLicensePlate()));
        assignment.setUser(normalUser.getUser());
        assignment.setVehicle(vehicle);
        userVehicleAssignmentRepository.save(assignment);

        ResponseEntity<Void> response = restTemplate.exchange(
                "/vehicles/" + vehicle.getLicensePlate(),
                HttpMethod.DELETE,
                new HttpEntity<>(createAuthHeaders(normalUser)),
                Void.class
        );

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        assertFalse(vehicleRepository.findById(vehicle.getLicensePlate()).isPresent());
    }

    @Test
    void testDeleteVehicle_shouldReturn403_ifNotOwner() {
        Vehicle vehicle = new Vehicle("DEL123", "Peugeot", "208", "Hatchback");
        vehicleRepository.save(vehicle);

        ResponseEntity<Void> response = restTemplate.exchange(
                "/vehicles/" + vehicle.getLicensePlate(),
                HttpMethod.DELETE,
                new HttpEntity<>(createAuthHeaders(normalUser)),
                Void.class
        );

        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
        assertTrue(vehicleRepository.findById(vehicle.getLicensePlate()).isPresent());
    }

}
