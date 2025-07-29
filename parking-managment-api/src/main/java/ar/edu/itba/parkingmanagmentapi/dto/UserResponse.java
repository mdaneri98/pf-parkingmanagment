package ar.edu.itba.parkingmanagmentapi.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserResponse {
    private String email;

    private String firstName;

    private String imageUrl;

    private UserDetailDTO userDetail;
}
