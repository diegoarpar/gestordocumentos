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
public class CreateProcessTaskCompleteService implements BaseService<ProcessDefinitionServiceRequest, ProcessDefinitionServiceResponse> {
    private final ProcessTaskService processTaskService;

    @Override
    public ProcessDefinitionServiceResponse execute(ProcessDefinitionServiceRequest information) {
        var taskId = information.getProcessInformation().get(ProcessInformation.TASK_ID.name());
        var userInformation = information.getProcessInformation().get(ProcessInformation.USER_NAME.name());
        processTaskService.completeTask(information.getTenant(),
                (String) taskId,
                (String) userInformation,
                information.getProcessInformation()
                );
        return null;
    }
}
