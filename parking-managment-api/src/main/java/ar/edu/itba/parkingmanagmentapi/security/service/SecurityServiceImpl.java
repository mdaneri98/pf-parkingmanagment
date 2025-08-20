package ar.edu.itba.parkingmanagmentapi.security.service;

import ar.edu.itba.parkingmanagmentapi.exceptions.AuthenticationFailedException;
import ar.edu.itba.parkingmanagmentapi.model.Manager;
import ar.edu.itba.parkingmanagmentapi.model.User;
import ar.edu.itba.parkingmanagmentapi.repository.ManagerRepository;
import ar.edu.itba.parkingmanagmentapi.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SecurityServiceImpl implements SecurityService {

    private final UserRepository userRepository;

    private final ManagerRepository managerRepository;

    @Override
    public Optional<String> getCurrentUserEmail() {
        final SecurityContext securityContext = SecurityContextHolder.getContext();
        if (securityContext != null && securityContext.getAuthentication() != null) {
            return Optional.of(securityContext.getAuthentication().getName());
        }
        return Optional.empty();
    }


    @Cacheable
    @Override
    public Optional<User> getCurrentUser() {
        final Optional<String> mayBeEmail = getCurrentUserEmail();

        if (mayBeEmail.isEmpty()) {
            throw new AuthenticationFailedException("User is not authorized to access this resource.");
        }

        return userRepository.findByEmail(mayBeEmail.get());
    }

    @Override
    @Cacheable
    public Optional<Manager> getCurrentManager() {
        Optional<User> currentUserOpt = getCurrentUser();
        User currentUser = currentUserOpt
                .orElseThrow(() -> new AuthenticationFailedException("No authenticated user found"));

        return managerRepository.findByUser(currentUser);
    }

}