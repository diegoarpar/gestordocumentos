package com.data.user.service;

import com.data.user.model.CredentialInformation;
import com.data.user.respository.CredentialRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * The credential repository.
 *
 * @author diegoarpar
 */
@Service
@RequiredArgsConstructor
public class CredentialServiceRepository {

    /**
     * The credential repository.
     */
    private final CredentialRepository repository;

    /**
     * Save the user.
     * @param model the user
     */
    public CredentialInformation save(CredentialInformation model) {
        return repository.save(model);
    }

    /**
     * Find a user.
     * @param model the user
     */
    public CredentialInformation find(CredentialInformation model) {
        return repository.findByValue(model.getValue());
    }
}
