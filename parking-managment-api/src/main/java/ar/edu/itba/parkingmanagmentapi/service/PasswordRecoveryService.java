package ar.edu.itba.parkingmanagmentapi.service;

import ar.edu.itba.parkingmanagmentapi.dto.PasswordRecoveryRequest;
import ar.edu.itba.parkingmanagmentapi.dto.PasswordRecoveryResponse;
import ar.edu.itba.parkingmanagmentapi.dto.ResetPasswordRequest;
import ar.edu.itba.parkingmanagmentapi.dto.VerifyRecoveryTokenRequest;

public interface PasswordRecoveryService {

    PasswordRecoveryResponse requestRecovery(PasswordRecoveryRequest request);

    boolean verifyToken(VerifyRecoveryTokenRequest request);

    void resetPassword(ResetPasswordRequest request);
}


