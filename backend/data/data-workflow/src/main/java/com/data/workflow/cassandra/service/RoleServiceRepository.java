package com.data.workflow.cassandra.service;

import com.data.workflow.cassandra.model.RoleInformation;
import com.data.workflow.cassandra.respository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

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

    /**
     * Delete a role by id.
     * @param id the role id
     */
    public void deleteById(UUID id) {
        repository.deleteById(id);
    }

    /**
     * Find a role.
     */
    public List<RoleInformation> find() {
        var results =  new ArrayList<RoleInformation>();
        repository.findAll().forEach((data) -> {
            var roleInformation = new RoleInformation();
            roleInformation.setId(data.getId());
            roleInformation.setName(data.getName());
            results.add(roleInformation);
        });
        return results;
    }
}
