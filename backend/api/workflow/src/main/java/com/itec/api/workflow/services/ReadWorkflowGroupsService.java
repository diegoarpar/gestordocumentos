package com.itec.api.workflow.services;

import com.data.workflow.cassandra.service.GroupServiceRepository;
import com.itec.api.workflow.model.Group;
import com.itec.api.workflow.model.GroupServiceRequest;
import com.itec.api.workflow.model.GroupServiceResponse;
import com.itec.utilities.service.BaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReadWorkflowGroupsService implements BaseService<GroupServiceRequest, GroupServiceResponse> {

    private final GroupServiceRepository groupServiceRepository;

    @Override
    public GroupServiceResponse execute(GroupServiceRequest information) {
        var results = groupServiceRepository.find();
        var groups = results.stream().map(g -> {
            var group = new Group();
            group.setId(g.getId());
            group.setName(g.getName());
            group.setDescription(g.getDescription());
            group.setActive(g.isActive());
            return group;
        }).toList();
        var response = new GroupServiceResponse();
        response.setGroups(groups);
        return response;
    }
}
