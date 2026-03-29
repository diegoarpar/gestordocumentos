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
    private final ReadActivityService readActivityService;
    private final ReadWorkflowService readWorkflowService;

    @Override
    public ProcessDefinitionServiceResponse execute(ProcessDefinitionServiceRequest information) {
        var taskId = information.getProcessInformation().get(ProcessInformation.TASK_ID.name());
        var tenantId = information.getTenant();
        var results = processTaskService.getTask(tenantId, (String) taskId);
        var response = new ProcessDefinitionServiceResponse();
        response.setTaskInformation(results);
        return response;
    }

    public ProcessDefinitionServiceResponse executeWithLink(ProcessDefinitionServiceRequest information) {
        var response = execute(information);
        var processKey = response.getTaskInformation().getFirst().get(ProcessInformation.PROCESS_DEFINITION_ID.name());
        var activityKey = response.getTaskInformation().getFirst().get(ProcessInformation.TASK_DEFINITION_KEY.name());
        //processKey = ((String) processKey).split(":")[0];
        //var process = readWorkflowService.getByKeyName((String) processKey);
        var activity = readActivityService.getByKeyName((String) activityKey);
        response.getTaskInformation().getFirst().put(ProcessInformation.TASK_FORM_URL.name(), activity.getActivities().getFirst().getHref());
        return response;
    }
}
