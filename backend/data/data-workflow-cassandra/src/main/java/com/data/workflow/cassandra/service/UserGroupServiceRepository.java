package com.data.workflow.cassandra.service;

import com.data.workflow.cassandra.model.UserGroupInformation;
import com.data.workflow.cassandra.respository.UserGroupRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * The user-group repository.
 *
 * @author diegoarpar
 */
@Service
@RequiredArgsConstructor
public class UserGroupServiceRepository {

    private final UserGroupRepository repository;

    public UserGroupInformation save(UserGroupInformation model) {
        return repository.save(model);
    }

    public void deleteById(UUID id) {
        repository.findAll().forEach(entity -> {
            if (id.equals(entity.getId())) {
                repository.delete(entity);
            }
        });
    }

    public List<UserGroupInformation> find() {
        var results = new ArrayList<UserGroupInformation>();
        repository.findAll().forEach(results::add);
        return results;
    }
}