package ar.edu.itba.parkingmanagmentapi.security.service;

import ar.edu.itba.parkingmanagmentapi.exceptions.NotFoundException;
import ar.edu.itba.parkingmanagmentapi.model.User;
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

    public EmailAuthenticationService(UserService userService, ManagerService managerService) {
        this.userService = userService;
        this.managerService = managerService;
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

        User user = userService.findByEmail(email)
                .orElseThrow(() -> {
                    logger.warn("User not found with email: {}", email);
                    return new NotFoundException("Email not found");
                });

        List<SimpleGrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_USER"));

        if (managerService.isUserManager(user.getId())) {
            logger.debug("User {} is also a manager, adding ROLE_MANAGER", user.getEmail());
            authorities.add(new SimpleGrantedAuthority("ROLE_MANAGER"));
        }

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPasswordHash(),
                authorities
        );
    }

} 