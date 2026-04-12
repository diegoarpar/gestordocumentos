package com.itec.api.authorization.services;

import com.itec.api.authorization.model.TokenServiceRequest;
import com.itec.api.authorization.model.TokenServiceResponse;
import com.itec.util.crypto.services.CryptoUtil;
import com.itec.util.jwt.services.helper.JWTUtil;
import com.itec.utilities.service.BaseService;
import lombok.RequiredArgsConstructor;
import org.apache.logging.log4j.util.Strings;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Create a credential.
 *
 * @author diegoarpar
 */
@Service
@RequiredArgsConstructor
public class CreateUserTokenService implements BaseService<TokenServiceRequest, TokenServiceResponse> {

    private final JWTUtil jwtUtil;

    private final ReadConsumerService readConsumerService;

    /**
     * Execute the service
     * @param information the information
     */
    @Override
    public TokenServiceResponse execute(TokenServiceRequest information) {
        var consumer = readConsumerService.readByConsumerId(information.getConsumerId()).getConsumers().getFirst();
        var crypto = CryptoUtil.builder().secret(consumer.getSecret()).build();
        var encryptedInformation = crypto.decrypt(information.getUserAuthorization());
        var jwt = jwtUtil.issueAccessToken(encryptedInformation, List.of("/**"));
        var response = new TokenServiceResponse();
        response.setUserAuthorization(jwt);
        return response;
    }
}
