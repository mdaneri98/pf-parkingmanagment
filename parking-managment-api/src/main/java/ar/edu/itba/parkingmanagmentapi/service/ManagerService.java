package ar.edu.itba.parkingmanagmentapi.service;

import ar.edu.itba.parkingmanagmentapi.dto.ManagerResponse;


public interface ManagerService {

    /**
     * Finds a manager by ID
     */
    ManagerResponse findById(Long id);

    /**
     * Finds a manager by user ID
     */
    ManagerResponse findByUserId(Long userId);

    /**
     * Checks if a user is a manager
     */
    boolean isUserManager(Long userId);
} 