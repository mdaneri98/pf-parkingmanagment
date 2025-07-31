package ar.edu.itba.parkingmanagmentapi.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserResponse {
    private Long id;

    private String email;

    private String firstName;

    private String lastName;

    private String imageUrl;

    private UserDetailDTO userDetail;
}
