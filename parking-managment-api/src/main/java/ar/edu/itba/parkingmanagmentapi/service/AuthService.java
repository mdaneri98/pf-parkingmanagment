package ar.edu.itba.parkingmanagmentapi.service;

import ar.edu.itba.parkingmanagmentapi.dto.LoginRequest;
import ar.edu.itba.parkingmanagmentapi.dto.LoginResponse;
import ar.edu.itba.parkingmanagmentapi.dto.RegisterRequest;
import ar.edu.itba.parkingmanagmentapi.dto.RegisterResponse;

public interface AuthService {

    /**
     * Authenticates a user and generates a JWT token
     */
    LoginResponse login(LoginRequest loginRequest);
    
    /**
     * Registers a new user
     */
    RegisterResponse register(RegisterRequest registerRequest);

}
