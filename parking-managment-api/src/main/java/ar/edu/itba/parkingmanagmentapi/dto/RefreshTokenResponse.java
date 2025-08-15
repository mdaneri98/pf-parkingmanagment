package ar.edu.itba.parkingmanagmentapi.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RefreshTokenResponse {
    private String token;
    private String email;
    private String refreshToken;
}


