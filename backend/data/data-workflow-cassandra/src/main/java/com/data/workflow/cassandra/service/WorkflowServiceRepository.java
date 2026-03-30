package com.data.workflow.cassandra.service;

import com.data.workflow.cassandra.model.WorkflowInformation;
import com.data.workflow.cassandra.respository.WorkflowRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class WorkflowServiceRepository {

    private final WorkflowRepository repository;

    public WorkflowInformation save(WorkflowInformation model) {
        return repository.save(model);
    }

    public WorkflowInformation find(WorkflowInformation model) {
        return repository.findByName(model.getName());
    }

    public void deleteById(UUID id) {
        repository.deleteById(id);
    }

    public List<WorkflowInformation> find() {
        var results = new ArrayList<WorkflowInformation>();
        repository.findAll().forEach((data) -> {
            var workflow = new WorkflowInformation();
            workflow.setId(data.getId());
            workflow.setName(data.getName());
            workflow.setHref(data.getHref());
            workflow.setDescription(data.getDescription());
            workflow.setActive(data.isActive());
            results.add(workflow);
        });
        return results;
    }

    public WorkflowInformation findById(String id) {
        return repository.findById(id);
    }

    public WorkflowInformation findByKeyName(String keyName) {
        return repository.findByLatestKeyName(keyName);
    }
}
