package com.data.workflow.cassandra.service;

import com.data.workflow.cassandra.model.GroupInformation;
import com.data.workflow.cassandra.respository.GroupRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * The group repository.
 *
 * @author diegoarpar
 */
@Service
@RequiredArgsConstructor
public class GroupServiceRepository {

    private final GroupRepository repository;

    public GroupInformation save(GroupInformation model) {
        return repository.save(model);
    }

    public GroupInformation find(GroupInformation model) {
        return repository.findByName(model.getName());
    }

    public void deleteById(UUID id) {
        repository.deleteById(id);
    }

    public List<GroupInformation> find() {
        var results = new ArrayList<GroupInformation>();
        repository.findAll().forEach((data) -> {
            var group = new GroupInformation();
            group.setId(data.getId());
            group.setName(data.getName());
            group.setDescription(data.getDescription());
            group.setActive(data.isActive());
            results.add(group);
        });
        return results;
    }
}
