package com.itec.api.workflow.services;

import com.data.workflow.activity.service.ProcessTaskService;
import com.itec.api.workflow.model.ProcessDefinitionServiceRequest;
import com.itec.api.workflow.model.ProcessDefinitionServiceResponse;
import com.itec.utilities.service.BaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CreateProcessTaskAssignService implements BaseService<ProcessDefinitionServiceRequest, ProcessDefinitionServiceResponse> {
    private final ProcessTaskService processTaskService;

    @Override
    public ProcessDefinitionServiceResponse execute(ProcessDefinitionServiceRequest information) {
        return null;
    }
}
