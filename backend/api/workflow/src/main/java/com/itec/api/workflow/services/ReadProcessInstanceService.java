package com.itec.api.workflow.services;

import com.data.workflow.activity.model.ProcessDefinitionRequest;
import com.data.workflow.activity.service.ProcessInstanceInformationService;
import com.itec.api.workflow.model.ProcessDefinitionServiceRequest;
import com.itec.api.workflow.model.ProcessDefinitionServiceResponse;
import com.itec.utilities.service.BaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReadProcessInstanceService implements BaseService<ProcessDefinitionServiceRequest, ProcessDefinitionServiceResponse> {
    private final ProcessInstanceInformationService processInstanceInformationService;

    @Override
    public ProcessDefinitionServiceResponse execute(ProcessDefinitionServiceRequest information) {
        var processDefinitionRequest = new ProcessDefinitionRequest();
        processDefinitionRequest.setInstanceId(information.getInstanceId());
        var result = processInstanceInformationService.execute(processDefinitionRequest);
        var response = new ProcessDefinitionServiceResponse();
        response.setProcessInformation(result.getInformation());
        response.setTaskInformation(result.getTaskInformation());
        response.setId(result.getId());
        return response;
    }
}
