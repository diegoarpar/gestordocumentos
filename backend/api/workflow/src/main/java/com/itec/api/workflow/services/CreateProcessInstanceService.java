package com.itec.api.workflow.services;

import com.data.workflow.activity.model.ProcessDefinitionRequest;
import com.data.workflow.activity.service.ProcessInitInstanceService;
import com.itec.api.workflow.model.ProcessDefinitionServiceRequest;
import com.itec.api.workflow.model.ProcessDefinitionServiceResponse;
import com.itec.utilities.service.BaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CreateProcessInstanceService implements BaseService<ProcessDefinitionServiceRequest, ProcessDefinitionServiceResponse> {
    private final ProcessInitInstanceService processInitInstanceService;
    @Override
    public ProcessDefinitionServiceResponse execute(ProcessDefinitionServiceRequest information) {
        var processDefinitionRequest = new ProcessDefinitionRequest();
        processDefinitionRequest.setWorkflowName(information.getWorkflowName());
        processDefinitionRequest.setProcessInformation(information.getProcessInformation());
        var result = processInitInstanceService.execute(processDefinitionRequest);
        var response = new ProcessDefinitionServiceResponse();
        response.setId(result.getId());
        return response;
    }
}
