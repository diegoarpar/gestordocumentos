package com.data.user.service;

import com.data.user.model.RoleInformation;
import com.data.user.respository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * The role repository.
 *
 * @author diegoarpar
 */
@Service
@RequiredArgsConstructor
public class RoleServiceRepository {

    /**
     * The role repository.
     */
    private final RoleRepository repository;

    /**
     * Save the user.
     * @param model the user
     */
    public RoleInformation save(RoleInformation model) {
        return repository.save(model);
    }

    /**
     * Find a user.
     * @param model the user
     */
    public RoleInformation find(RoleInformation model) {
        return repository.findByName(model.getName());
    }
}
