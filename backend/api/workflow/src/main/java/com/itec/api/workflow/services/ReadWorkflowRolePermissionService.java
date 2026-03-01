package com.itec.api.workflow.services;

import com.data.workflow.cassandra.service.RolePermissionServiceRepository;
import com.itec.api.workflow.model.RolePermission;
import com.itec.api.workflow.model.RolePermissionServiceRequest;
import com.itec.api.workflow.model.RolePermissionServiceResponse;
import com.itec.utilities.service.BaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReadWorkflowRolePermissionService implements BaseService<RolePermissionServiceRequest, RolePermissionServiceResponse> {

    private final RolePermissionServiceRepository rolePermissionServiceRepository;

    @Override
    public RolePermissionServiceResponse execute(RolePermissionServiceRequest information) {
        var results = rolePermissionServiceRepository.find();
        var rolePermissions = results.stream().map(rp -> {
            var rolePermission = new RolePermission();
            rolePermission.setId(rp.getId());
            rolePermission.setRoleId(rp.getRoleId());
            rolePermission.setPermissionId(rp.getPermissionId());
            return rolePermission;
        }).toList();
        var response = new RolePermissionServiceResponse();
        response.setRolePermissions(rolePermissions);
        return response;
    }
}
