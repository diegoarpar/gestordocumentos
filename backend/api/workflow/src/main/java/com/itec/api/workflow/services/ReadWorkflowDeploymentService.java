package com.itec.api.workflow.services;

import com.data.workflow.rd.service.WorkflowDeploymentServiceRepository;
import com.itec.api.workflow.model.WorkflowDeployment;
import com.itec.api.workflow.model.WorkflowDeploymentServiceRequest;
import com.itec.api.workflow.model.WorkflowDeploymentServiceResponse;
import com.itec.utilities.service.BaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReadWorkflowDeploymentService implements BaseService<WorkflowDeploymentServiceRequest, WorkflowDeploymentServiceResponse> {

    private final WorkflowDeploymentServiceRepository workflowDeploymentServiceRepository;

    @Override
    public WorkflowDeploymentServiceResponse execute(WorkflowDeploymentServiceRequest information) {
        var results = information.getWorkflowId() != null
                ? workflowDeploymentServiceRepository.findByWorkflowId(UUID.fromString(information.getWorkflowId()))
                : workflowDeploymentServiceRepository.find();
        var deployments = results.stream().map(d -> {
            var deployment = new WorkflowDeployment();
            deployment.setId(d.getId());
            deployment.setWorkflowId(d.getWorkflowId());
            deployment.setFileName(d.getFileName());
            deployment.setFilePath(d.getFilePath());
            deployment.setDeployedBy(d.getDeployedBy());
            deployment.setStatus(d.getStatus());
            deployment.setTimestamp(d.getTimestamp());
            return deployment;
        }).toList();
        var response = new WorkflowDeploymentServiceResponse();
        response.setDeployments(deployments);
        return response;
    }
}
