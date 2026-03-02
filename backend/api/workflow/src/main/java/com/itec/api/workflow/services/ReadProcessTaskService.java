package com.itec.api.workflow.services;

import com.data.workflow.activity.model.ProcessInformation;
import com.data.workflow.activity.service.ProcessTaskService;
import com.itec.api.workflow.model.ProcessDefinitionServiceRequest;
import com.itec.api.workflow.model.ProcessDefinitionServiceResponse;
import com.itec.utilities.service.BaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReadProcessTaskService implements BaseService<ProcessDefinitionServiceRequest, ProcessDefinitionServiceResponse> {
    private final ProcessTaskService processTaskService;

    @Override
    public ProcessDefinitionServiceResponse execute(ProcessDefinitionServiceRequest information) {
        var taskId = information.getProcessInformation().get(ProcessInformation.TASK_ID.name());
        var tenantId = information.getTenant();
        var results = processTaskService.getTask(tenantId, (String) taskId);
        var response = new ProcessDefinitionServiceResponse();
        response.setTaskInformation(results);
        return response;
    }
}
