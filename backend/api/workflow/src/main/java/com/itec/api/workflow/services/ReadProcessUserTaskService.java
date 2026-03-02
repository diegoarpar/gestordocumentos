package com.itec.api.workflow.services;

import com.data.workflow.activity.model.ProcessInformation;
import com.data.workflow.activity.service.ProcessTaskService;
import com.itec.api.workflow.model.ProcessDefinitionServiceRequest;
import com.itec.api.workflow.model.ProcessDefinitionServiceResponse;
import com.itec.utilities.service.BaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReadProcessUserTaskService implements BaseService<ProcessDefinitionServiceRequest, ProcessDefinitionServiceResponse> {
    private final ProcessTaskService processTaskService;

    @Override
    public ProcessDefinitionServiceResponse execute(ProcessDefinitionServiceRequest information) {
        var userId = information.getProcessInformation().get(ProcessInformation.USER_NAME.name());
        var tenantId = information.getTenant();
        var results = processTaskService.getTask(tenantId, (String) userId, List.of());
        var response = new ProcessDefinitionServiceResponse();
        response.setTaskInformation(results);
        return response;
    }
}
