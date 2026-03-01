package com.itec.api.workflow.services;

import com.data.workflow.cassandra.model.GroupInformation;
import com.data.workflow.cassandra.service.GroupServiceRepository;
import com.itec.api.workflow.model.GroupServiceRequest;
import com.itec.api.workflow.model.GroupServiceResponse;
import com.itec.utilities.service.BaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UpdateWorkflowGroupsService implements BaseService<GroupServiceRequest, GroupServiceResponse> {

    private final GroupServiceRepository groupServiceRepository;

    @Override
    public GroupServiceResponse execute(GroupServiceRequest information) {
        var group = new GroupInformation();
        group.setId(UUID.fromString(information.getId()));
        group.setName(information.getName());
        group.setDescription(information.getDescription());
        group.setActive(information.isActive());
        groupServiceRepository.save(group);
        return new GroupServiceResponse();
    }
}
