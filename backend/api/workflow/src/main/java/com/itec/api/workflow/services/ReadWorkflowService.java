package com.itec.api.workflow.services;

import com.data.workflow.cassandra.service.WorkflowServiceRepository;
import com.itec.api.workflow.model.Workflow;
import com.itec.api.workflow.model.WorkflowServiceRequest;
import com.itec.api.workflow.model.WorkflowServiceResponse;
import com.itec.utilities.service.BaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReadWorkflowService implements BaseService<WorkflowServiceRequest, WorkflowServiceResponse> {

    private final WorkflowServiceRepository workflowServiceRepository;

    @Override
    public WorkflowServiceResponse execute(WorkflowServiceRequest information) {
        var results = workflowServiceRepository.find();
        var workflows = results.stream().map(w -> {
            var workflow = new Workflow();
            workflow.setId(w.getId());
            workflow.setHref(w.getHref());
            workflow.setName(w.getName());
            workflow.setDescription(w.getDescription());
            workflow.setActive(w.isActive());
            return workflow;
        }).toList();
        var response = new WorkflowServiceResponse();
        response.setWorkflows(workflows);
        return response;
    }

    public WorkflowServiceResponse getById(WorkflowServiceRequest information) {
        var result = workflowServiceRepository.findById(information.getId());
        var workflow = new Workflow();
        workflow.setId(result.getId());
        workflow.setDescription(result.getDescription());
        workflow.setLatestKeyName(result.getLatestKeyName());
        workflow.setName(result.getName());
        var response = new WorkflowServiceResponse();
        response.setWorkflows(List.of(workflow));
        return response;
    }

    public WorkflowServiceResponse getByKeyName(String keyName) {
        var result = workflowServiceRepository.findByKeyName(keyName);
        var workflow = new Workflow();
        workflow.setId(result.getId());
        workflow.setDescription(result.getDescription());
        workflow.setLatestKeyName(result.getLatestKeyName());
        workflow.setName(result.getName());
        var response = new WorkflowServiceResponse();
        response.setWorkflows(List.of(workflow));
        return response;
    }
}
