package ar.edu.itba.parkingmanagmentapi.util;

import ar.edu.itba.parkingmanagmentapi.dto.UserDetailDTO;
import ar.edu.itba.parkingmanagmentapi.dto.UserResponse;
import ar.edu.itba.parkingmanagmentapi.model.User;

import java.util.Objects;
import java.util.Optional;

public class UserMapper {

    public static UserResponse toUserResponse(User user) {
        if (Objects.isNull(user)) return null;

        UserResponse dto = new UserResponse();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setImageUrl(user.getImageUrl());

        UserDetailDTO detail = new UserDetailDTO();
        Optional.ofNullable(user.getUserDetail()).ifPresent(d -> {
            detail.setPhone(d.getPhone());
            detail.setAddress(d.getAddress());
            detail.setLang(d.getLang());
        });

        dto.setUserDetail(detail);

        return dto;
    }
}

