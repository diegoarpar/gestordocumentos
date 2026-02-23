package com.itec.api.authentication.services;

import com.data.user.model.CredentialInformation;
import com.data.user.service.CredentialServiceRepository;
import com.itec.api.authentication.model.CredentialAuthenticationServiceRequest;
import com.itec.api.authentication.model.CredentialAuthenticationServiceResponse;
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
public class CreateCredentialAuthenticationService implements BaseService<CredentialAuthenticationServiceRequest, CredentialAuthenticationServiceResponse> {

    /**
     * The credential repository
     */
    private final CredentialServiceRepository credentialServiceRepository;

    /**
     * Execute the service
     * @param information the information
     */
    @Override
    public CredentialAuthenticationServiceResponse execute(CredentialAuthenticationServiceRequest information) {
        var role = CredentialInformation.builder().active(true).value(information.getCredential().getName()).build();
        credentialServiceRepository.save(role);
        return new CredentialAuthenticationServiceResponse();
    }
}
