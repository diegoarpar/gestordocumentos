package com.itec.api.workflow.services;

import com.data.workflow.cassandra.service.GroupServiceRepository;
import com.itec.api.workflow.model.GroupServiceRequest;
import com.itec.api.workflow.model.GroupServiceResponse;
import com.itec.utilities.service.BaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DeleteWorkflowGroupsService implements BaseService<GroupServiceRequest, GroupServiceResponse> {

    private final GroupServiceRepository groupServiceRepository;

    @Override
    public GroupServiceResponse execute(GroupServiceRequest information) {
        groupServiceRepository.deleteById(UUID.fromString(information.getId()));
        return new GroupServiceResponse();
    }
}
