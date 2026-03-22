package com.itec.api.workflow.services;

import com.data.workflow.cassandra.service.WorkflowActivityServiceRepository;
import com.itec.api.workflow.model.WorkflowActivityServiceRequest;
import com.itec.api.workflow.model.WorkflowActivityServiceResponse;
import com.itec.utilities.service.BaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DeleteWorkflowActivityService implements BaseService<WorkflowActivityServiceRequest, WorkflowActivityServiceResponse> {

    private final WorkflowActivityServiceRepository workflowActivityServiceRepository;

    @Override
    public WorkflowActivityServiceResponse execute(WorkflowActivityServiceRequest information) {
        workflowActivityServiceRepository.deleteById(UUID.fromString(information.getId()));
        return new WorkflowActivityServiceResponse();
    }
}
