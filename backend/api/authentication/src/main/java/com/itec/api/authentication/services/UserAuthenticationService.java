package com.itec.api.authentication.services;

import com.itec.api.authentication.configuration.ApiAuthenticationProperties;
import com.itec.api.authentication.model.UserAuthenticationServiceRequest;
import com.itec.api.authentication.model.UserAuthenticationServiceResponse;
import com.itec.util.authorization.services.UtilAuthorizationService;
import com.itec.util.crypto.services.CryptoUtil;
import com.itec.utilities.service.BaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class UserAuthenticationService implements BaseService<UserAuthenticationServiceRequest, UserAuthenticationServiceResponse> {

    private final UtilAuthorizationService utilAuthorizationService;
    private final ApiAuthenticationProperties apiAuthenticationProperties;
    private final CryptoUtil cryptoUtil;

    @Override
    public UserAuthenticationServiceResponse execute(UserAuthenticationServiceRequest information) {
        var encryptedUser = cryptoUtil.encrypt(information.getUser().getName());
        var header = Map.of("consumer-id", apiAuthenticationProperties.getId(), "Authorization", "user_authorization=" + encryptedUser);
        var response = utilAuthorizationService.getUserToken(header);
        var userAuthentication = new UserAuthenticationServiceResponse();
        userAuthentication.setJwt((String) response.get("userAuthorization"));
        return userAuthentication;
    }
}
