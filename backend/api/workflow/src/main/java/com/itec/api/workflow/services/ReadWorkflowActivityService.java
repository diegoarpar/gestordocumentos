package com.itec.api.workflow.services;

import com.data.workflow.cassandra.service.WorkflowActivityServiceRepository;
import com.itec.api.workflow.model.WorkflowActivity;
import com.itec.api.workflow.model.WorkflowActivityServiceRequest;
import com.itec.api.workflow.model.WorkflowActivityServiceResponse;
import com.itec.utilities.service.BaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReadWorkflowActivityService implements BaseService<WorkflowActivityServiceRequest, WorkflowActivityServiceResponse> {

    private final WorkflowActivityServiceRepository workflowActivityServiceRepository;

    @Override
    public WorkflowActivityServiceResponse execute(WorkflowActivityServiceRequest information) {
        var results = information.getWorkflowId() != null
                ? workflowActivityServiceRepository.findByWorkflowId(UUID.fromString(information.getWorkflowId()))
                : workflowActivityServiceRepository.find();
        var items = results.stream().map(wa -> {
            var workflowActivity = new WorkflowActivity();
            workflowActivity.setId(wa.getId());
            workflowActivity.setWorkflowId(wa.getWorkflowId());
            workflowActivity.setActivityId(wa.getActivityId());
            return workflowActivity;
        }).toList();
        var response = new WorkflowActivityServiceResponse();
        response.setWorkflowActivities(items);
        return response;
    }
}
