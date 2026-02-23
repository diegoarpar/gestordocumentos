package com.itec.api.authentication.services;

import com.data.user.model.CredentialInformation;
import com.data.user.service.CredentialServiceRepository;
import com.itec.api.authentication.model.CredentialAuthenticationServiceRequest;
import com.itec.api.authentication.model.CredentialAuthenticationServiceResponse;
import com.itec.utilities.service.BaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * Read Credential.
 *
 * @author diegoarpar
 */
@Service
@RequiredArgsConstructor
public class ReadCredentialAuthenticationService implements BaseService<CredentialAuthenticationServiceRequest, CredentialAuthenticationServiceResponse> {

    /**
     * The credential repository.
     */
    private final CredentialServiceRepository credentialServiceRepository;

    /**
     * Execute the service
     * @param information the information
     */
    @Override
    public CredentialAuthenticationServiceResponse execute(CredentialAuthenticationServiceRequest information) {
        var response = new CredentialAuthenticationServiceResponse();
        response.setCredential(new com.itec.api.authentication.model.Credential());
        var credential = credentialServiceRepository.find(CredentialInformation.builder().value(information.getCredential().getName()).build());
        response.getCredential().setName(credential.getValue());
        return response;
    }
}
