package ar.edu.itba.parkingmanagmentapi.service;

import ar.edu.itba.parkingmanagmentapi.model.RefreshToken;
import ar.edu.itba.parkingmanagmentapi.model.User;

public interface RefreshTokenService {

    RefreshToken createRefreshToken(User user, boolean rotatePrevious);

    RefreshToken validateAndRotate(String presentedToken);

    void revokeAllForUser(User user);

    void revokeByToken(String presentedToken);
}


