package com.data.user.service;

import com.data.user.model.UserInformation;
import com.data.user.respository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * The user repository.
 *
 * @author diegoarpar
 */
@Service
@RequiredArgsConstructor
public class UserServiceRepository {

    /**
     * The user repository.
     */
    private final UserRepository repository;

    /**
     * Save the user.
     * @param model the user
     */
    public UserInformation save(UserInformation model) {
        return repository.save(model);
    }

    /**
     * Find a user.
     * @param model the user
     */
    public UserInformation find(UserInformation model) {
        return repository.findByName(model.getName());
    }
}
