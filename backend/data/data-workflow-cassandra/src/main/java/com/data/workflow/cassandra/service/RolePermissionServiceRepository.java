package com.data.workflow.cassandra.service;

import com.data.workflow.cassandra.model.RolePermissionInformation;
import com.data.workflow.cassandra.respository.RolePermissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * The role-permission repository.
 *
 * @author diegoarpar
 */
@Service
@RequiredArgsConstructor
public class RolePermissionServiceRepository {

    private final RolePermissionRepository repository;

    public RolePermissionInformation save(RolePermissionInformation model) {
        return repository.save(model);
    }

    public void deleteById(UUID id) {
        repository.findAll().forEach(entity -> {
            if (id.equals(entity.getId())) {
                repository.delete(entity);
            }
        });
    }

    public List<RolePermissionInformation> find() {
        var results = new ArrayList<RolePermissionInformation>();
        repository.findAll().forEach(results::add);
        return results;
    }
}