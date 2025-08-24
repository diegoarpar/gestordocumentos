package com.itec.api.authentication.services;

import com.itec.api.authentication.model.UserAuthenticationServiceRequest;
import com.itec.api.authentication.model.UserAuthenticationServiceResponse;
import com.itec.api.authorization.services.AuthorizationService;
import com.itec.utilities.service.BaseService;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class UserAuthenticationService implements BaseService<UserAuthenticationServiceRequest, UserAuthenticationServiceResponse> {

    private AuthorizationService authorizationService;

    public UserAuthenticationService(AuthorizationService authorizationService) {
        this.authorizationService = authorizationService;
    }

    @Override
    public UserAuthenticationServiceResponse execute(UserAuthenticationServiceRequest information) {
        var result = authorizationService.generateToken(Map.of(), information.getEmail());
        var userAuthentication = new UserAuthenticationServiceResponse();
        userAuthentication.setJwt(result);
        return userAuthentication;
    }
}
