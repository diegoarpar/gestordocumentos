package com.itec.api.authorization.services;

import com.itec.api.authorization.model.TokenServiceRequest;
import com.itec.api.authorization.model.TokenServiceResponse;
import com.itec.util.jwt.services.helper.JWTUtil;
import com.itec.utilities.service.BaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * Create a credential.
 *
 * @author diegoarpar
 */
@Service
@RequiredArgsConstructor
public class UpdateApplicationTokenService implements BaseService<TokenServiceRequest, TokenServiceResponse> {

    private final JWTUtil jwtUtil;

    /**
     * Execute the service
     * @param information the information
     */
    @Override
    public TokenServiceResponse execute(TokenServiceRequest information) {
        return new TokenServiceResponse();
    }
}
