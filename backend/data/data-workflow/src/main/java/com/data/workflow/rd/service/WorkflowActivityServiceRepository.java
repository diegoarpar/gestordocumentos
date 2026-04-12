package com.data.workflow.rd.service;

import com.data.workflow.rd.model.WorkflowActivityInformation;
import com.data.workflow.rd.respository.WorkflowActivityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class WorkflowActivityServiceRepository {

    private final WorkflowActivityRepository repository;

    public WorkflowActivityInformation save(WorkflowActivityInformation model) {
        return repository.save(model);
    }

    public void deleteById(UUID id) {
        repository.findAll().forEach(entity -> {
            if (id.equals(entity.getId())) {
                repository.delete(entity);
            }
        });
    }

    public List<WorkflowActivityInformation> find() {
        var results = new ArrayList<WorkflowActivityInformation>();
        repository.findAll().forEach(results::add);
        return results;
    }

    public List<WorkflowActivityInformation> findByWorkflowId(UUID workflowId) {
        var results = new ArrayList<WorkflowActivityInformation>();
        repository.findAll().forEach(entity -> {
            if (workflowId.equals(entity.getWorkflowId())) {
                results.add(entity);
            }
        });
        return results;
    }
}
