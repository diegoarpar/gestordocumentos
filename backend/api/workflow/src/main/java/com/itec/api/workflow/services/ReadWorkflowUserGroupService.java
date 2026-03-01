package com.itec.api.workflow.services;

import com.data.workflow.cassandra.service.UserGroupServiceRepository;
import com.itec.api.workflow.model.UserGroup;
import com.itec.api.workflow.model.UserGroupServiceRequest;
import com.itec.api.workflow.model.UserGroupServiceResponse;
import com.itec.utilities.service.BaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReadWorkflowUserGroupService implements BaseService<UserGroupServiceRequest, UserGroupServiceResponse> {

    private final UserGroupServiceRepository userGroupServiceRepository;

    @Override
    public UserGroupServiceResponse execute(UserGroupServiceRequest information) {
        var results = userGroupServiceRepository.find();
        var userGroups = results.stream().map(ug -> {
            var userGroup = new UserGroup();
            userGroup.setId(ug.getId());
            userGroup.setUserName(ug.getUserName());
            userGroup.setGroupId(ug.getGroupId());
            return userGroup;
        }).toList();
        var response = new UserGroupServiceResponse();
        response.setUserGroups(userGroups);
        return response;
    }
}