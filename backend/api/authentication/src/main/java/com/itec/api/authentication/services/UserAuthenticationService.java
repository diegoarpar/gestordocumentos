package com.itec.api.authentication.services;

import com.itec.api.authentication.model.UserAuthenticationServiceRequest;
import com.itec.api.authentication.model.UserAuthenticationServiceResponse;
import com.itec.utilities.service.BaseService;
import org.springframework.stereotype.Service;

@Service
public class UserAuthenticationService implements BaseService<UserAuthenticationServiceRequest, UserAuthenticationServiceResponse> {

    @Override
    public UserAuthenticationServiceResponse execute(UserAuthenticationServiceRequest information) {
        return null;
    }
}
