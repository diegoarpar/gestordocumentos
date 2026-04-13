package com.data.workflow.rd.service;

import com.data.workflow.rd.model.WorkflowDeploymentInformation;
import com.data.workflow.rd.respository.WorkflowDeploymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class WorkflowDeploymentServiceRepository {

    private final WorkflowDeploymentRepository repository;

    public WorkflowDeploymentInformation save(WorkflowDeploymentInformation model) {
        return repository.save(model);
    }

    public void deleteById(UUID id) {
        repository.deleteById(id);
    }

    public List<WorkflowDeploymentInformation> find() {
        var results = new ArrayList<WorkflowDeploymentInformation>();
        repository.findAll().forEach(results::add);
        return results;
    }

    public List<WorkflowDeploymentInformation> findByWorkflowId(UUID workflowId) {
        return repository.findByWorkflowId(workflowId);
    }

    public List<WorkflowDeploymentInformation> findByDeployedBy(String deployedBy) {
        return repository.findByDeployedBy(deployedBy);
    }
}
