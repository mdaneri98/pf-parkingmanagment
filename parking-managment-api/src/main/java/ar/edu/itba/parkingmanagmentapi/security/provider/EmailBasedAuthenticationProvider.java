package ar.edu.itba.parkingmanagmentapi.security.provider;

import ar.edu.itba.parkingmanagmentapi.exceptions.AuthenticationFailedException;
import ar.edu.itba.parkingmanagmentapi.exceptions.BadCredentialsException;
import ar.edu.itba.parkingmanagmentapi.exceptions.BaseException;
import ar.edu.itba.parkingmanagmentapi.security.service.EmailAuthenticationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Custom authentication provider that explicitly handles email-based authentication.
 * This avoids the confusion between 'username' and 'email' in Spring Security's
 * UserDetailsService interface.
 */
@Component
public class EmailBasedAuthenticationProvider implements AuthenticationProvider {

    private static final Logger logger = LoggerFactory.getLogger(EmailBasedAuthenticationProvider.class);

    private final EmailAuthenticationService emailAuthService;
    private final PasswordEncoder passwordEncoder;

    public EmailBasedAuthenticationProvider(EmailAuthenticationService emailAuthService,
                                            PasswordEncoder passwordEncoder) {
        this.emailAuthService = emailAuthService;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        String email = authentication.getName();
        String password = authentication.getCredentials().toString();

        logger.debug("Authenticating user by email: {}", email);

        try {
            UserDetails userDetails = emailAuthService.loadUserByEmail(email);

            if (passwordEncoder.matches(password, userDetails.getPassword())) {
                logger.debug("Authentication successful for email: {}", email);
                return new UsernamePasswordAuthenticationToken(
                        userDetails,
                        password,
                        userDetails.getAuthorities()
                );
            } else {
                logger.warn("Invalid password for email: {}", email);
                throw new AuthenticationFailedException("Invalid credentials");
            }
        } catch (BaseException e) {
            logger.warn("Authentication failed for email: {}", email, e);
            throw new BadCredentialsException("Invalid credentials");
        }
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return UsernamePasswordAuthenticationToken.class.isAssignableFrom(authentication);
    }
} 