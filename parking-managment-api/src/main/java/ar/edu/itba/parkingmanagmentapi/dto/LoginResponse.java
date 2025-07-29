package ar.edu.itba.parkingmanagmentapi.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class LoginResponse {
    private String token;
    private String type = "Bearer";
    private String username;
    private String message;

    public LoginResponse() {
    }

    public LoginResponse(String token, String username, String message) {
        this.token = token;
        this.username = username;
        this.message = message;
    }
} 