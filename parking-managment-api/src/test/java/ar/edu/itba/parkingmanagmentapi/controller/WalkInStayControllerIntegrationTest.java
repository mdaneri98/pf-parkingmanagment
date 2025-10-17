package ar.edu.itba.parkingmanagmentapi.controller;

import ar.edu.itba.parkingmanagmentapi.BaseIntegrationTest;
import ar.edu.itba.parkingmanagmentapi.dto.ApiResponse;
import ar.edu.itba.parkingmanagmentapi.dto.PageResponse;
import ar.edu.itba.parkingmanagmentapi.dto.ReservationResponse;
import ar.edu.itba.parkingmanagmentapi.dto.WalkInStayRequest;
import ar.edu.itba.parkingmanagmentapi.dto.enums.ReservationStatus;
import ar.edu.itba.parkingmanagmentapi.model.WalkInStay;
import org.junit.jupiter.api.Test;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

class WalkInStayControllerIntegrationTest extends BaseIntegrationTest {

    @Test
    void testCreateWalkInStay_shouldReturn201_andPersisted() {
        WalkInStayRequest request = new WalkInStayRequest();
        request.setSpotId(otherSpot.getId());
        request.setVehicleLicensePlate(existingVehicle.getLicensePlate());
        request.setExpectedDurationHours(4);

        HttpEntity<WalkInStayRequest> requestEntity = new HttpEntity<>(request, createAuthHeaders(managerUser));

        ResponseEntity<ApiResponse<ReservationResponse>> response = restTemplate.exchange(
                "/reservations/walk-in",
                HttpMethod.POST,
                requestEntity,
                new ParameterizedTypeReference<>() {
                }
        );

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());

        ReservationResponse data = response.getBody().getData();
        assertEquals(request.getSpotId(), data.getSpotId());
        assertEquals(request.getVehicleLicensePlate(), data.getVehicleLicensePlate());

        Optional<WalkInStay> savedOpt = walkInStayRepository.findById(data.getId());
        assertTrue(savedOpt.isPresent());
    }

    @Test
    void testGetWalkInStaysByUser_shouldReturnOnlyUserReservations() {
        WalkInStay stay = existingWalkInStay;

        ResponseEntity<ApiResponse<PageResponse<ReservationResponse>>> response = restTemplate.exchange(
                "/reservations/walk-in?userId=" + normalUser.getId(),
                HttpMethod.GET,
                new HttpEntity<>(createAuthHeaders(normalUser)),
                new ParameterizedTypeReference<>() {
                }
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());

        PageResponse<ReservationResponse> page = response.getBody().getData();
        assertTrue(page.getContent().stream().allMatch(r -> r.getUserId().equals(normalUser.getId())));
        assertEquals(1, page.getContent().size());
        assertEquals(stay.getId(), page.getContent().get(0).getId());
    }

    @Test
    void testUpdateWalkInStayStatus_shouldReturn200_andUpdateStatus() {
        WalkInStay stay = existingWalkInStay;

        ResponseEntity<ApiResponse<ReservationResponse>> response = restTemplate.exchange(
                "/reservations/walk-in/" + stay.getId() + "/status?status=CANCELLED",
                HttpMethod.PATCH,
                new HttpEntity<>(createAuthHeaders(managerUser)),
                new ParameterizedTypeReference<>() {
                }
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
        ReservationResponse updated = response.getBody().getData();
        assertEquals(ReservationStatus.CANCELLED, updated.getStatus());

        WalkInStay saved = walkInStayRepository.findById(stay.getId()).orElseThrow();
        assertEquals(ReservationStatus.CANCELLED, saved.getStatus());
    }

    @Test
    void testExtendWalkInStay_shouldReturn200_andUpdateExpectedEndTime() {
        WalkInStay stay = existingWalkInStay;
        int extraHours = 2;

        LocalDateTime previousEndTime = stay.getExpectedEndTime();

        ResponseEntity<ApiResponse<ReservationResponse>> response = restTemplate.exchange(
                "/reservations/walk-in/" + stay.getId() + "/extend?extraHours=" + extraHours,
                HttpMethod.PATCH,
                new HttpEntity<>(createAuthHeaders(managerUser)),
                new ParameterizedTypeReference<>() {
                }
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
        ReservationResponse updated = response.getBody().getData();
        assertEquals(previousEndTime.plusHours(extraHours), updated.getExpectedEndTime());
    }

    @Test
    void testRemainingTime_shouldReturn200_withDuration() {
        WalkInStay stay = existingWalkInStay;

        ResponseEntity<ApiResponse<String>> response = restTemplate.exchange(
                "/reservations/walk-in/" + stay.getId() + "/remaining-time",
                HttpMethod.GET,
                new HttpEntity<>(createAuthHeaders(normalUser)),
                new ParameterizedTypeReference<>() {
                }
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().getData().contains("Remaining"));
    }
}
