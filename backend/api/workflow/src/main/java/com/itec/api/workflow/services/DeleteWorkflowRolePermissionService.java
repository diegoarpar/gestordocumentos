package com.itec.api.workflow.services;

import com.data.workflow.cassandra.service.RolePermissionServiceRepository;
import com.itec.api.workflow.model.RolePermissionServiceRequest;
import com.itec.api.workflow.model.RolePermissionServiceResponse;
import com.itec.utilities.service.BaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DeleteWorkflowRolePermissionService implements BaseService<RolePermissionServiceRequest, RolePermissionServiceResponse> {

    private final RolePermissionServiceRepository rolePermissionServiceRepository;

    @Override
    public RolePermissionServiceResponse execute(RolePermissionServiceRequest information) {
        rolePermissionServiceRepository.deleteById(UUID.fromString(information.getId()));
        return new RolePermissionServiceResponse();
    }
}
