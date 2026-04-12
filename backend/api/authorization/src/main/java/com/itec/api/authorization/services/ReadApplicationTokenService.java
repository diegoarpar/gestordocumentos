package com.itec.api.authorization.services;

import com.itec.api.authorization.model.TokenServiceRequest;
import com.itec.api.authorization.model.TokenServiceResponse;
import com.itec.utilities.service.BaseService;
import org.springframework.stereotype.Service;

/**
 * Create a credential.
 *
 * @author diegoarpar
 */
@Service
public class ReadApplicationTokenService implements BaseService<TokenServiceRequest, TokenServiceResponse> {

    /**
     * Execute the service
     * @param information the information
     */
    @Override
    public TokenServiceResponse execute(TokenServiceRequest information) {
        return new TokenServiceResponse();
    }
}
