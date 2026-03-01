package com.itec.api.workflow.services;

import com.data.workflow.cassandra.service.UserGroupServiceRepository;
import com.itec.api.workflow.model.UserGroupServiceRequest;
import com.itec.api.workflow.model.UserGroupServiceResponse;
import com.itec.utilities.service.BaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DeleteWorkflowUserGroupService implements BaseService<UserGroupServiceRequest, UserGroupServiceResponse> {

    private final UserGroupServiceRepository userGroupServiceRepository;

    @Override
    public UserGroupServiceResponse execute(UserGroupServiceRequest information) {
        userGroupServiceRepository.deleteById(UUID.fromString(information.getId()));
        return new UserGroupServiceResponse();
    }
}