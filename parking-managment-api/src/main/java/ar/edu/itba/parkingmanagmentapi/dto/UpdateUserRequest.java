package ar.edu.itba.parkingmanagmentapi.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateUserRequest {
    private Long id;

    private String firstName;

    private String lastName;

    private String email;

    private String passwordHash;

    private String imageUrl;

    private UserDetailDTO userDetail;
}
