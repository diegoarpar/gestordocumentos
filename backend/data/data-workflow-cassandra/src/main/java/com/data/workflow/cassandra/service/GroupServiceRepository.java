package com.data.workflow.cassandra.service;

import com.data.workflow.cassandra.model.GroupInformation;
import com.data.workflow.cassandra.respository.GroupRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * The role repository.
 *
 * @author diegoarpar
 */
@Service
@RequiredArgsConstructor
public class GroupServiceRepository {

    /**
     * The role repository.
     */
    private final GroupRepository repository;

    /**
     * Save the user.
     * @param model the user
     */
    public GroupInformation save(GroupInformation model) {
        return repository.save(model);
    }

    /**
     * Find a user.
     * @param model the user
     */
    public GroupInformation find(GroupInformation model) {
        return repository.findByName(model.getName());
    }
}
