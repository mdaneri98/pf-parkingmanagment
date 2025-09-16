package ar.edu.itba.parkingmanagmentapi.controller;

import ar.edu.itba.parkingmanagmentapi.BaseIntegrationTest;
import ar.edu.itba.parkingmanagmentapi.dto.ApiResponse;
import ar.edu.itba.parkingmanagmentapi.dto.ParkingPriceRequest;
import ar.edu.itba.parkingmanagmentapi.dto.ParkingPriceResponse;
import ar.edu.itba.parkingmanagmentapi.dto.enums.VehicleType;
import ar.edu.itba.parkingmanagmentapi.model.ParkingPrice;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

class ParkingPriceControllerIntegrationTest extends BaseIntegrationTest {


    @Test
    void testCreateParkingPrice_shouldReturn201_andPersisted() {
        ParkingPriceRequest request = new ParkingPriceRequest();
        request.setVehicleType(VehicleType.BICYCLE.getName());
        request.setPrice(new BigDecimal("100"));
        request.setValidFrom(LocalDateTime.now());
        request.setValidTo(LocalDateTime.now().plusDays(7));

        HttpEntity<ParkingPriceRequest> requestEntity = new HttpEntity<>(request, createAuthHeaders(managerUser));

        ResponseEntity<ApiResponse<ParkingPriceResponse>> response = restTemplate.exchange(
                "/parking-lots/" + existingParkingLot.getId() + "/prices",
                HttpMethod.POST,
                requestEntity,
                new ParameterizedTypeReference<>() {
                }
        );

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        ParkingPriceResponse responseData = response.getBody().getData();
        assertEquals(VehicleType.BICYCLE.getName(), responseData.getVehicleType());
        assertEquals(new BigDecimal("100"), responseData.getPrice());

        Optional<ParkingPrice> savedOpt = parkingPriceRepository.findById(responseData.getId());
        assertTrue(savedOpt.isPresent());
        ParkingPrice saved = savedOpt.get();
        assertEquals(VehicleType.BICYCLE.getName(), saved.getVehicleType());
        assertEquals(new BigDecimal("100.00"), saved.getPrice());
    }

    @Test
    void testGetByParkingLot_shouldReturnAllPrices() {
        ParkingPrice price1 = existingParkingPrice;
        ParkingPrice price2 = new ParkingPrice(VehicleType.MOTORCYCLE.getName(), new BigDecimal("30"), LocalDateTime.now(), LocalDateTime.now().plusDays(3), existingParkingLot);
        parkingPriceRepository.saveAll(List.of(price1, price2));

        ResponseEntity<ApiResponse<List<ParkingPriceResponse>>> response = restTemplate.exchange(
                "/parking-lots/" + existingParkingLot.getId() + "/prices",
                HttpMethod.GET,
                new HttpEntity<>(createAuthHeaders(managerUser)),
                new ParameterizedTypeReference<>() {
                }
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        List<ParkingPriceResponse> prices = response.getBody().getData();
        assertEquals(2, prices.size());
        List<String> vehicleTypes = prices.stream().map(ParkingPriceResponse::getVehicleType).toList();
        assertTrue(vehicleTypes.containsAll(List.of(VehicleType.CAR.getName(), VehicleType.MOTORCYCLE.getName())));
    }

    @ParameterizedTest
    @CsvSource({
            "10, 50, 2",    // ambos precios entran en el rango
            "10, 20, 1",    // solo el de 10 entra
            "60, 70, 0"     // ninguno entra
    })
    void testGetPrices_shouldReturnAllPricesInRange(String minStr, String maxStr, int expectedCount) {
        ParkingPrice price1 = existingParkingPrice;
        ParkingPrice price2 = new ParkingPrice(VehicleType.MOTORCYCLE.getName(), new BigDecimal("30"), LocalDateTime.now(), LocalDateTime.now().plusDays(3), existingParkingLot);
        parkingPriceRepository.saveAll(List.of(price1, price2));

        BigDecimal min = new BigDecimal(minStr);
        BigDecimal max = new BigDecimal(maxStr);

        ResponseEntity<ApiResponse<List<ParkingPriceResponse>>> response = restTemplate.exchange(
                "/parking-lots/" + existingParkingLot.getId() + "/prices?min=" + min + "&max=" + max,
                HttpMethod.GET,
                new HttpEntity<>(createAuthHeaders(managerUser)),
                new ParameterizedTypeReference<>() {
                }
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        List<ParkingPriceResponse> prices = response.getBody().getData();
        assertEquals(expectedCount, prices.size());
    }

    @ParameterizedTest
    @CsvSource({
            "asc",
            "desc"
    })
    void testGetPrices_shouldReturnAllPricesSorted(String sort) {
        ParkingPrice price1 = existingParkingPrice;
        ParkingPrice price2 = new ParkingPrice(VehicleType.MOTORCYCLE.getName(), new BigDecimal("30"), LocalDateTime.now(), LocalDateTime.now().plusDays(3), existingParkingLot);
        parkingPriceRepository.saveAll(List.of(price1, price2));

        ResponseEntity<ApiResponse<List<ParkingPriceResponse>>> response = restTemplate.exchange(
                "/parking-lots/" + existingParkingLot.getId() + "/prices?sort=" + sort,
                HttpMethod.GET,
                new HttpEntity<>(createAuthHeaders(managerUser)),
                new ParameterizedTypeReference<>() {
                }
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        List<ParkingPriceResponse> prices = response.getBody().getData();
        assertEquals(2, prices.size());

        List<BigDecimal> actualPrices = prices.stream().map(ParkingPriceResponse::getPrice).toList();
        List<BigDecimal> expected = new ArrayList<>(actualPrices);
        if ("desc".equalsIgnoreCase(sort)) {
            expected.sort(Comparator.reverseOrder());
        } else {
            expected.sort(Comparator.naturalOrder());
        }
        assertEquals(expected, actualPrices, "Los precios deberían estar ordenados según 'sort'");
    }

    @Test
    void testUpdateParkingPrice_shouldReturn200_andPersisted() {
        ParkingPrice price = existingParkingPrice;

        ParkingPriceRequest updateRequest = new ParkingPriceRequest();
        updateRequest.setVehicleType(VehicleType.CAR.getName());
        updateRequest.setPrice(new BigDecimal("60"));
        updateRequest.setValidFrom(LocalDateTime.now());
        updateRequest.setValidTo(LocalDateTime.now().plusDays(5));

        HttpEntity<ParkingPriceRequest> requestEntity = new HttpEntity<>(updateRequest, createAuthHeaders(managerUser));

        ResponseEntity<ApiResponse<ParkingPriceResponse>> response = restTemplate.exchange(
                "/parking-lots/" + existingParkingLot.getId() + "/prices/" + price.getId(),
                HttpMethod.PUT,
                requestEntity,
                new ParameterizedTypeReference<>() {
                }
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        ParkingPriceResponse updated = response.getBody().getData();
        assertEquals(new BigDecimal("60"), updated.getPrice());

        ParkingPrice saved = parkingPriceRepository.findById(price.getId()).orElseThrow();
        assertEquals(new BigDecimal("60.00"), saved.getPrice());
    }

    @Test
    void testDeleteParkingPrice_shouldReturn204_andRemoved() {
        ParkingPrice price = existingParkingPrice;

        ResponseEntity<Void> response = restTemplate.exchange(
                "/parking-lots/" + existingParkingLot.getId() + "/prices/" + existingParkingPrice.getId(),
                HttpMethod.DELETE,
                new HttpEntity<>(createAuthHeaders(managerUser)),
                Void.class
        );

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        assertFalse(parkingPriceRepository.findById(price.getId()).isPresent());
    }

    @Test
    void testCreateParkingPrice_shouldReturn403_ifNotManager() {
        ParkingPriceRequest request = new ParkingPriceRequest();
        request.setVehicleType(VehicleType.CAR.getName());
        request.setPrice(new BigDecimal("100"));
        request.setValidFrom(LocalDateTime.now());

        HttpEntity<ParkingPriceRequest> requestEntity = new HttpEntity<>(request, createAuthHeaders(normalUser));

        ResponseEntity<ApiResponse<ParkingPriceResponse>> response = restTemplate.exchange(
                "/parking-lots/" + existingParkingLot.getId() + "/prices",
                HttpMethod.POST,
                requestEntity,
                new ParameterizedTypeReference<>() {
                }
        );

        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
    }
}
