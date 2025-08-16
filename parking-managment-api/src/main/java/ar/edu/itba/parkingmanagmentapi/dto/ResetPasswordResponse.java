package ar.edu.itba.parkingmanagmentapi.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ResetPasswordResponse {
    private boolean done;
}
