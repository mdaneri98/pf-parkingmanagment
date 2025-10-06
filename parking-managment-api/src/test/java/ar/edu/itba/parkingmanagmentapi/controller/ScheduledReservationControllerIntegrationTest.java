package ar.edu.itba.parkingmanagmentapi.controller;

import ar.edu.itba.parkingmanagmentapi.BaseIntegrationTest;
import ar.edu.itba.parkingmanagmentapi.dto.ApiResponse;
import ar.edu.itba.parkingmanagmentapi.dto.PageResponse;
import ar.edu.itba.parkingmanagmentapi.dto.ReservationResponse;
import ar.edu.itba.parkingmanagmentapi.dto.ScheduledReservationRequest;
import ar.edu.itba.parkingmanagmentapi.dto.enums.ReservationStatus;
import ar.edu.itba.parkingmanagmentapi.model.ScheduledReservation;
import org.junit.jupiter.api.Test;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

class ScheduledReservationControllerIntegrationTest extends BaseIntegrationTest {
    @Test
    void testCreateReservation_shouldReturn201_andPersisted() {
        ScheduledReservationRequest request = new ScheduledReservationRequest();
        request.setUserId(normalUser.getId());
        request.setReservedStartTime(LocalDateTime.now());
        request.setExpectedEndTime(LocalDateTime.now().plusHours(1));
        request.setSpotId(otherSpot.getId());
        request.setVehicleLicensePlate(existingVehicle.getLicensePlate());

        HttpEntity<ScheduledReservationRequest> requestEntity = new HttpEntity<>(request, createAuthHeaders(normalUser));

        ResponseEntity<ApiResponse<ReservationResponse>> response = restTemplate.exchange(
                "/reservations/scheduled",
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

        Optional<ScheduledReservation> savedOpt = reservationRepository.findById(data.getId());
        assertTrue(savedOpt.isPresent());
    }

    @Test
    void testCreateReservation_shouldReturn400_alreadyReserved() {
        ScheduledReservationRequest request = new ScheduledReservationRequest();
        request.setUserId(normalUser.getId());
        request.setReservedStartTime(LocalDateTime.of(2025, 9, 1, 10, 0));
        request.setExpectedEndTime(LocalDateTime.of(2025, 9, 1, 11, 0));
        request.setSpotId(existingSpot.getId());
        request.setVehicleLicensePlate(existingVehicle.getLicensePlate());

        HttpEntity<ScheduledReservationRequest> requestEntity = new HttpEntity<>(request, createAuthHeaders(normalUser));

        ResponseEntity<ApiResponse<ReservationResponse>> response = restTemplate.exchange(
                "/reservations/scheduled",
                HttpMethod.POST,
                requestEntity,
                new ParameterizedTypeReference<>() {
                }
        );

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().getMessage().toLowerCase().contains("already reserved"));
    }

    @Test
    void testGetReservation_shouldReturn200_andReservation() {
        ScheduledReservation reservation = existingReservation;

        ResponseEntity<ApiResponse<ReservationResponse>> response = restTemplate.exchange(
                "/reservations/scheduled/" + reservation.getId(),
                HttpMethod.GET,
                new HttpEntity<>(createAuthHeaders(normalUser)),
                new ParameterizedTypeReference<>() {
                }
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(reservation.getId(), response.getBody().getData().getId());
    }

    @Test
    void testGetReservationsByUser_shouldReturnOnlyUserReservations() {
        ScheduledReservation r1 = existingReservation;

        ResponseEntity<ApiResponse<PageResponse<ReservationResponse>>> response = restTemplate.exchange(
                "/reservations/scheduled?userId=" + normalUser.getId(),
                HttpMethod.GET,
                new HttpEntity<>(createAuthHeaders(normalUser)),
                new ParameterizedTypeReference<>() {
                }
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());

        PageResponse<ReservationResponse> page = response.getBody().getData();
        assertEquals(1, page.getTotalElements());
        assertEquals(1, page.getContent().size());
        assertEquals(r1.getId(), page.getContent().get(0).getId());
    }

    @Test
    void testCancelReservation_shouldReturn200_andUpdateStatus() {
        ScheduledReservation reservation = existingReservation;

        ResponseEntity<ApiResponse<ReservationResponse>> response = restTemplate.exchange(
                "/reservations/scheduled/" + reservation.getId() + "/status?status=CANCELLED",
                HttpMethod.PATCH,
                new HttpEntity<>(createAuthHeaders(normalUser)),
                new ParameterizedTypeReference<>() {
                }
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
        ReservationResponse cancelled = response.getBody().getData();
        assertEquals(ReservationStatus.CANCELLED, cancelled.getStatus());

        ScheduledReservation saved = reservationRepository.findById(reservation.getId()).orElseThrow();
        assertEquals(ReservationStatus.CANCELLED, saved.getStatus());
    }

    @Test
    void testCancelReservation_shouldReturn200_whenCurrentUserIsManager_updateStatus() {
        ScheduledReservation reservation = existingReservation;

        ResponseEntity<ApiResponse<ReservationResponse>> response = restTemplate.exchange(
                "/reservations/scheduled/" + reservation.getId() + "/status?status=CONFIRMED",
                HttpMethod.PATCH,
                new HttpEntity<>(createAuthHeaders(managerUser)),
                new ParameterizedTypeReference<>() {
                }
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
        ReservationResponse cancelled = response.getBody().getData();
        assertEquals(ReservationStatus.CONFIRMED, cancelled.getStatus());

        ScheduledReservation saved = reservationRepository.findById(reservation.getId()).orElseThrow();
        assertEquals(ReservationStatus.CONFIRMED, saved.getStatus());
    }

    @Test
    void testCancelReservation_shouldReturn403_ifNotOwner() {
        ScheduledReservation reservation = existingReservation;

        ResponseEntity<ApiResponse<ReservationResponse>> response = restTemplate.exchange(
                "/reservations/scheduled/" + reservation.getId() + "/status?status=CANCELLED",
                HttpMethod.PATCH,
                new HttpEntity<>(createAuthHeaders(otherUser)),
                new ParameterizedTypeReference<>() {
                }
        );

        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
    }

}
