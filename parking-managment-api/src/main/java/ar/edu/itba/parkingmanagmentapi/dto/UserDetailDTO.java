package ar.edu.itba.parkingmanagmentapi.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class UserDetailDTO {
    private String lastName;
    private String phone;
    private String address;

}
