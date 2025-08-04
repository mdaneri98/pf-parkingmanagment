package ar.edu.itba.parkingmanagmentapi.service;

import ar.edu.itba.parkingmanagmentapi.dto.ManagerResponse;
import ar.edu.itba.parkingmanagmentapi.exceptions.NotFoundException;
import ar.edu.itba.parkingmanagmentapi.repository.ManagerRepository;
import ar.edu.itba.parkingmanagmentapi.util.ManagerMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ManagerServiceImpl implements ManagerService {

    private static final Logger logger = LoggerFactory.getLogger(ManagerServiceImpl.class);

    private final ManagerRepository managerRepository;

    public ManagerServiceImpl(ManagerRepository managerRepository) {
        this.managerRepository = managerRepository;
    }

    /**
     * Finds a manager by ID
     */
    @Override
    @Transactional(readOnly = true)
    public ManagerResponse findById(Long id) {
        logger.debug("Finding manager by ID: {}", id);
        return managerRepository.findById(id)
                .map(ManagerMapper::toResponse)
                .orElseThrow(() -> new NotFoundException("Manager not found with ID: " + id));
    }

    /**
     * Finds a manager by user ID
     */
    @Override
    @Transactional(readOnly = true)
    public ManagerResponse findByUserId(Long userId) {
        logger.debug("Finding manager by user ID: {}", userId);
        return managerRepository.findByUserId(userId)
                .map(ManagerMapper::toResponse)
                .orElseThrow(() -> new NotFoundException("Manager not found with user ID: " + userId));
    }

    /**
     * Checks if a user is a manager
     */
    @Override
    @Transactional(readOnly = true)
    public boolean isUserManager(Long userId) {
        logger.debug("Checking if user {} is a manager", userId);
        return managerRepository.existsByUserId(userId);
    }
} 