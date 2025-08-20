package ar.edu.itba.parkingmanagmentapi.security.service;

import ar.edu.itba.parkingmanagmentapi.model.Manager;
import ar.edu.itba.parkingmanagmentapi.model.User;

import java.util.Optional;

public interface SecurityService {
    Optional<User> getCurrentUser();

    //boolean isCurrentUserAdmin();
    Optional<String> getCurrentUserEmail();

    Optional<Manager> getCurrentManager();
}