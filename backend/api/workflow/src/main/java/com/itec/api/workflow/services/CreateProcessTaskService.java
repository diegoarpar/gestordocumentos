package com.itec.api.workflow.services;

import com.data.workflow.activity.service.ProcessTaskService;
import com.itec.api.workflow.model.ProcessDefinitionServiceRequest;
import com.itec.api.workflow.model.ProcessDefinitionServiceResponse;
import com.data.workflow.activity.model.ProcessInformation;
import com.itec.utilities.service.BaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CreateProcessTaskService implements BaseService<ProcessDefinitionServiceRequest, ProcessDefinitionServiceResponse> {
    private final ProcessTaskService processTaskService;

    @Override
    public ProcessDefinitionServiceResponse execute(ProcessDefinitionServiceRequest information) {
        var userName =  information.getProcessInformation().get(ProcessInformation.USER_NAME.name());
        var taskId = information.getProcessInformation().get(ProcessInformation.TASK_ID.name());
        processTaskService.assign(information.getTenant(),
                (String) taskId,
                (String) userName
        );
        return null;
    }
}
