package com.itec.api.workflow.services;

import com.data.workflow.cassandra.model.WorkflowInformation;
import com.data.workflow.cassandra.service.WorkflowServiceRepository;
import com.itec.api.workflow.model.WorkflowServiceRequest;
import com.itec.api.workflow.model.WorkflowServiceResponse;
import com.itec.utilities.service.BaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UpdateWorkflowService implements BaseService<WorkflowServiceRequest, WorkflowServiceResponse> {

    private final WorkflowServiceRepository workflowServiceRepository;

    @Override
    public WorkflowServiceResponse execute(WorkflowServiceRequest information) {
        var workflow = new WorkflowInformation();
        workflow.setId(UUID.fromString(information.getId()));
        workflow.setName(information.getName());
        workflow.setHref(information.getHref());
        workflow.setDescription(information.getDescription());
        workflow.setActive(information.isActive());
        workflowServiceRepository.save(workflow);
        return new WorkflowServiceResponse();
    }

    public WorkflowServiceResponse updateLatestVersion(String id, String latestVersion) {
        var workflow = workflowServiceRepository.findById(id);
        workflow.setLatestKeyName(latestVersion);
        workflowServiceRepository.save(workflow);
        return new WorkflowServiceResponse();
    }
}
