package com.itec.api.workflow.services;

import com.data.workflow.rd.service.WorkflowDeploymentServiceRepository;
import com.itec.api.workflow.model.WorkflowDeploymentServiceRequest;
import com.itec.api.workflow.model.WorkflowDeploymentServiceResponse;
import com.itec.utilities.service.BaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DeleteWorkflowDeploymentService implements BaseService<WorkflowDeploymentServiceRequest, WorkflowDeploymentServiceResponse> {

    private final WorkflowDeploymentServiceRepository workflowDeploymentServiceRepository;

    @Override
    public WorkflowDeploymentServiceResponse execute(WorkflowDeploymentServiceRequest information) {
        workflowDeploymentServiceRepository.deleteById(UUID.fromString(information.getId()));
        return new WorkflowDeploymentServiceResponse();
    }
}
