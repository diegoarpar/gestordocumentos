package com.itec.api.workflow.services;

import com.data.workflow.rd.model.WorkflowInformation;
import com.data.workflow.rd.service.WorkflowServiceRepository;
import com.itec.api.workflow.model.WorkflowServiceRequest;
import com.itec.api.workflow.model.WorkflowServiceResponse;
import com.itec.utilities.service.BaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CreateWorkflowService implements BaseService<WorkflowServiceRequest, WorkflowServiceResponse> {

    private final WorkflowServiceRepository workflowServiceRepository;

    @Override
    public WorkflowServiceResponse execute(WorkflowServiceRequest information) {
        var workflow = new WorkflowInformation();
        workflow.setName(information.getName());
        workflow.setHref(information.getHref());
        workflow.setLatestKeyName(information.getLatestKeyName());
        workflow.setDescription(information.getDescription());
        workflow.setActive(true);
        workflowServiceRepository.save(workflow);
        return new WorkflowServiceResponse();
    }
}
