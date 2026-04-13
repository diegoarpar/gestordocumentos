package com.itec.api.authentication.services;

import com.itec.api.authentication.model.UserAuthenticationServiceRequest;
import com.itec.api.authentication.model.UserAuthenticationServiceResponse;
import com.itec.util.authorization.services.UtilAuthorizationService;
import com.itec.utilities.service.BaseService;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class UserAuthenticationService implements BaseService<UserAuthenticationServiceRequest, UserAuthenticationServiceResponse> {

    private UtilAuthorizationService utilAuthorizationService;

    public UserAuthenticationService(UtilAuthorizationService utilAuthorizationService) {
        this.utilAuthorizationService = utilAuthorizationService;
    }

    @Override
    public UserAuthenticationServiceResponse execute(UserAuthenticationServiceRequest information) {
        var result = utilAuthorizationService.generateToken(Map.of(), information.getEmail());
        var userAuthentication = new UserAuthenticationServiceResponse();
        userAuthentication.setJwt(result);
        return userAuthentication;
    }
}
