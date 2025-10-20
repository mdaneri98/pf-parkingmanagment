package ar.edu.itba.parkingmanagmentapi.dto;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserDetailDTO {
    private String phone;
    private String address;
    private String lang;
}
