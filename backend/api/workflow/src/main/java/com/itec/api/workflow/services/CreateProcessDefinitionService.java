package com.itec.api.workflow.services;

import com.data.workflow.activity.model.ProcessDefinitionRequest;
import com.data.workflow.activity.service.ProcessDefinitionService;
import com.itec.api.workflow.model.ProcessDefinitionServiceRequest;
import com.itec.api.workflow.model.ProcessDefinitionServiceResponse;
import com.itec.utilities.service.BaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CreateProcessDefinitionService implements BaseService<ProcessDefinitionServiceRequest, ProcessDefinitionServiceResponse> {

    private final ProcessDefinitionService processDefinitionService;

    @Override
    public ProcessDefinitionServiceResponse execute(ProcessDefinitionServiceRequest information) {
        var processDefinitionServiceRequest = new ProcessDefinitionRequest();
        processDefinitionServiceRequest.setInputStream(information.getInputStream());
        processDefinitionServiceRequest.setOriginalName(information.getOriginalName());
        var result = processDefinitionService.execute(processDefinitionServiceRequest);
        var response = new ProcessDefinitionServiceResponse();
        response.setId(result.getId());
        return response;
    }
}
