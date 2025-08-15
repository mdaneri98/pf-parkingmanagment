package ar.edu.itba.parkingmanagmentapi.service;

import ar.edu.itba.parkingmanagmentapi.dto.LoginRequest;
import ar.edu.itba.parkingmanagmentapi.dto.LoginResponse;
import ar.edu.itba.parkingmanagmentapi.dto.RefreshTokenResponse;
import ar.edu.itba.parkingmanagmentapi.dto.RegisterRequest;
import ar.edu.itba.parkingmanagmentapi.dto.RegisterResponse;

public interface AuthService {

    /**
     * Authenticates a user and generates a JWT token
     */
    LoginResponse login(LoginRequest loginRequest);
    
    /**
     * Registers a new user
     * @param registerRequest the registration data
     * @param isManager whether to create the user as a manager
     * @return RegisterResponse with registration details
     */
    RegisterResponse register(RegisterRequest registerRequest, boolean isManager);

    /**
     * Refreshes a JWT token
     * @param refreshToken the refresh token
     * @return RefreshTokenResponse with the new token
     */
    RefreshTokenResponse refresh(String refreshToken);

    /**
     * Logs out a session by revoking the provided refresh token.
     * @param refreshToken the refresh token to revoke
     */
    void logout(String refreshToken);

}
