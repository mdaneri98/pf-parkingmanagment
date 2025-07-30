package ar.edu.itba.parkingmanagmentapi.util;

import ar.edu.itba.parkingmanagmentapi.dto.ManagerResponse;
import ar.edu.itba.parkingmanagmentapi.model.Manager;

public class ManagerMapper {
    public static ManagerResponse toResponse(Manager manager) {
        ManagerResponse response = new ManagerResponse();
        response.setId(manager.getId());
        return response;
    }
}
