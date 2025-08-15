package ar.edu.itba.parkingmanagmentapi.service;

import ar.edu.itba.parkingmanagmentapi.repository.AdminRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminServiceImpl implements AdminService {
    private static final Logger logger = LoggerFactory.getLogger(AdminServiceImpl.class);

    private final AdminRepository adminRepository;

    public AdminServiceImpl(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isUserAdmin(Long userId) {
        logger.debug("Checking if user {} is an admin", userId);
        return adminRepository.existsByUserId(userId);
    }
}


