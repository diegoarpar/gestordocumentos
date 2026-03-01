package com.itec.api.workflow.services;

import com.data.workflow.cassandra.model.RolePermissionInformation;
import com.data.workflow.cassandra.service.RolePermissionServiceRepository;
import com.itec.api.workflow.model.RolePermissionServiceRequest;
import com.itec.api.workflow.model.RolePermissionServiceResponse;
import com.itec.utilities.service.BaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CreateWorkflowRolePermissionService implements BaseService<RolePermissionServiceRequest, RolePermissionServiceResponse> {

    private final RolePermissionServiceRepository rolePermissionServiceRepository;

    @Override
    public RolePermissionServiceResponse execute(RolePermissionServiceRequest information) {
        var rolePermission = new RolePermissionInformation();
        rolePermission.setId(UUID.randomUUID());
        rolePermission.setRoleId(UUID.fromString(information.getRoleId()));
        rolePermission.setPermissionId(UUID.fromString(information.getPermissionId()));
        rolePermissionServiceRepository.save(rolePermission);
        return new RolePermissionServiceResponse();
    }
}
