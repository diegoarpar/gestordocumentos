package com.data.workflow.cassandra.service;

import com.data.workflow.cassandra.model.PermissionInformation;
import com.data.workflow.cassandra.respository.PermissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * The permission repository.
 *
 * @author diegoarpar
 */
@Service
@RequiredArgsConstructor
public class PermissionServiceRepository {

    private final PermissionRepository repository;

    public PermissionInformation save(PermissionInformation model) {
        return repository.save(model);
    }

    public PermissionInformation find(PermissionInformation model) {
        return repository.findByName(model.getName());
    }

    public void deleteById(UUID id) {
        repository.deleteById(id);
    }

    public List<PermissionInformation> find() {
        var results = new ArrayList<PermissionInformation>();
        repository.findAll().forEach((data) -> {
            var permission = new PermissionInformation();
            permission.setId(data.getId());
            permission.setName(data.getName());
            permission.setDescription(data.getDescription());
            permission.setActive(data.isActive());
            results.add(permission);
        });
        return results;
    }
}