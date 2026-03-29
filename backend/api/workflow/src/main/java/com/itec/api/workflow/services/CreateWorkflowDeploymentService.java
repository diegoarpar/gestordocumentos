package com.itec.api.workflow.services;

import com.data.workflow.activity.model.ProcessDefinitionRequest;
import com.data.workflow.activity.service.ProcessDefinitionService;
import com.data.workflow.cassandra.model.WorkflowDeploymentInformation;
import com.data.workflow.cassandra.service.WorkflowDeploymentServiceRepository;
import com.itec.api.workflow.model.WorkflowDeploymentServiceRequest;
import com.itec.api.workflow.model.WorkflowDeploymentServiceResponse;
import com.itec.utilities.service.BaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CreateWorkflowDeploymentService implements BaseService<WorkflowDeploymentServiceRequest, WorkflowDeploymentServiceResponse> {

    private final WorkflowDeploymentServiceRepository workflowDeploymentServiceRepository;

    private final ProcessDefinitionService processDefinitionService;

    private final UpdateWorkflowService updateWorkflowService;

    private final ReadWorkflowService readWorkflowService;

    @Override
    public WorkflowDeploymentServiceResponse execute(WorkflowDeploymentServiceRequest information) {
        var deployment = new WorkflowDeploymentInformation();
        var processDefinitionRequest = new ProcessDefinitionRequest();
        processDefinitionRequest.setProcessInformation(information.getProcessInformation());
        var file = information.getFile();
        processDefinitionRequest.setOriginalName(file.getOriginalFilename());
        processDefinitionRequest.setWorkflowName(information.getWorkflowId());
        try {
            processDefinitionRequest.setInputStream(file.getInputStream());
            var result = processDefinitionService.execute(processDefinitionRequest);
            updateWorkflowService.updateLatestVersion(information.getWorkflowId(), result.getName());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        deployment.setId(UUID.randomUUID());
        deployment.setWorkflowId(UUID.fromString(information.getWorkflowId()));
        deployment.setFileName(information.getFileName());
        deployment.setFilePath(information.getFilePath());
        deployment.setDeployedBy(information.getDeployedBy());
        deployment.setStatus(information.getStatus());
        deployment.setTimestamp(Instant.now());

        workflowDeploymentServiceRepository.save(deployment);
        return new WorkflowDeploymentServiceResponse();
    }
}
