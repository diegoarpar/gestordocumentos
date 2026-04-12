package com.itec.api.workflow.services;

import com.data.workflow.rd.model.WorkflowActivityInformation;
import com.data.workflow.rd.service.WorkflowActivityServiceRepository;
import com.itec.api.workflow.model.WorkflowActivityServiceRequest;
import com.itec.api.workflow.model.WorkflowActivityServiceResponse;
import com.itec.utilities.service.BaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CreateWorkflowActivityService implements BaseService<WorkflowActivityServiceRequest, WorkflowActivityServiceResponse> {

    private final WorkflowActivityServiceRepository workflowActivityServiceRepository;

    @Override
    public WorkflowActivityServiceResponse execute(WorkflowActivityServiceRequest information) {
        var workflowActivity = new WorkflowActivityInformation();
        workflowActivity.setWorkflowId(UUID.fromString(information.getWorkflowId()));
        workflowActivity.setActivityId(UUID.fromString(information.getActivityId()));
        workflowActivityServiceRepository.save(workflowActivity);
        return new WorkflowActivityServiceResponse();
    }
}
