package com.itec.api.workflow.services;

import com.data.workflow.rd.service.WorkflowServiceRepository;
import com.itec.api.workflow.model.WorkflowServiceRequest;
import com.itec.api.workflow.model.WorkflowServiceResponse;
import com.itec.utilities.service.BaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DeleteWorkflowService implements BaseService<WorkflowServiceRequest, WorkflowServiceResponse> {

    private final WorkflowServiceRepository workflowServiceRepository;

    @Override
    public WorkflowServiceResponse execute(WorkflowServiceRequest information) {
        workflowServiceRepository.deleteById(information.getId());
        return new WorkflowServiceResponse();
    }
}
