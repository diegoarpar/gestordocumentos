package com.itec.api.authorization.services;

import com.itec.api.authorization.model.UserAuthorizationServiceRequest;
import com.itec.api.authorization.model.UserAuthorizationServiceResponse;
import com.itec.utilities.service.BaseService;
import org.springframework.stereotype.Service;

@Service
public class UserAuthorizationService implements BaseService<UserAuthorizationServiceRequest, UserAuthorizationServiceResponse> {

    @Override
    public UserAuthorizationServiceResponse execute(UserAuthorizationServiceRequest information) {
        return null;
    }
}
