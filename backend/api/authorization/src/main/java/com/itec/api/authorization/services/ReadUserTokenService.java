package com.itec.api.authorization.services;

import com.itec.api.authorization.model.TokenServiceRequest;
import com.itec.api.authorization.model.TokenServiceResponse;
import com.itec.util.crypto.services.CryptoUtil;
import com.itec.util.jwt.services.helper.JWTUtil;
import com.itec.utilities.service.BaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static com.itec.util.authorization.helper.Constants.CLAIM_USER;

/**
 * Create a credential.
 *
 * @author diegoarpar
 */
@Service
@RequiredArgsConstructor
public class ReadUserTokenService implements BaseService<TokenServiceRequest, TokenServiceResponse> {

    private final JWTUtil jwtUtil;

    private final ReadConsumerService readConsumerService;

    private final CryptoUtil cryptoUtil;

    /**
     * Execute the service
     * @param information the information
     */
    @Override
    public TokenServiceResponse execute(TokenServiceRequest information) {
        var consumer = readConsumerService.readByConsumerId(information.getConsumerId()).getConsumers().getFirst();
        var crypto = CryptoUtil.builder().secret(consumer.getSecret()).build();
        var decryptedInformation = crypto.decrypt(information.getUserAuthorization());

        var receivedJwt = jwtUtil.validateToken(decryptedInformation);
        var decryptedUser = receivedJwt.getClaim(CLAIM_USER).asString();
        var user = cryptoUtil.decrypt(decryptedUser);
        var scopes = receivedJwt.getClaim("scopes").asArray(String.class);
        var response = new TokenServiceResponse();
        var newJwt = jwtUtil.renewAccessToken(decryptedInformation, user, Arrays.asList(scopes));
        response.setUserId(user);
        response.setUserAuthorization(newJwt);
        return response;
    }
}
