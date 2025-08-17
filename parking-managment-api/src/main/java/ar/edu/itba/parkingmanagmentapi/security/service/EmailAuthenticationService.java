package ar.edu.itba.parkingmanagmentapi.security.service;

import ar.edu.itba.parkingmanagmentapi.exceptions.NotFoundException;
import ar.edu.itba.parkingmanagmentapi.model.User;
import ar.edu.itba.parkingmanagmentapi.service.AdminService;
import ar.edu.itba.parkingmanagmentapi.service.ManagerService;
import ar.edu.itba.parkingmanagmentapi.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/**
 * Service specifically for email-based user authentication.
 * This service provides a clean API for email-based operations without
 * the confusion of Spring Security's username/email terminology.
 */
@Service
public class EmailAuthenticationService {
    private static final Logger logger = LoggerFactory.getLogger(EmailAuthenticationService.class);
    private final UserService userService;
    private final ManagerService managerService;
    private final AdminService adminService;

    public EmailAuthenticationService(UserService userService, ManagerService managerService, AdminService adminService) {
        this.userService = userService;
        this.managerService = managerService;
        this.adminService = adminService;
    }

    /**
     * Load user details by email address.
     * This is the primary method for email-based authentication.
     *
     * @param email the email address to search for
     * @return UserDetails for the user
     * @throws UsernameNotFoundException if user not found
     */
    @Transactional(readOnly = true)
    public UserDetails loadUserByEmail(String email) throws UsernameNotFoundException {
        logger.debug("Loading user by email: {}", email);

        User user = userService.findEntityByEmail(email)
                .orElseThrow(() -> {
                    logger.warn("User not found with email: {}", email);
                    return new NotFoundException("Email not found");
                });

        List<SimpleGrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_USER"));

        if (managerService.isUserManager(user.getId())) {
            authorities.add(new SimpleGrantedAuthority("ROLE_MANAGER"));
        }

        if (adminService.isUserAdmin(user.getId())) {
            authorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
        }

        logger.debug("User has successfully loaded with authorities: {}", authorities);

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPasswordHash(),
                authorities
        );
    }

} 