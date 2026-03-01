package com.itec.api.workflow.services;

import com.data.workflow.cassandra.service.PermissionServiceRepository;
import com.itec.api.workflow.model.Permission;
import com.itec.api.workflow.model.PermissionServiceRequest;
import com.itec.api.workflow.model.PermissionServiceResponse;
import com.itec.utilities.service.BaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReadWorkflowPermissionsService implements BaseService<PermissionServiceRequest, PermissionServiceResponse> {

    private final PermissionServiceRepository permissionServiceRepository;

    @Override
    public PermissionServiceResponse execute(PermissionServiceRequest information) {
        var results = permissionServiceRepository.find();
        var permissions = results.stream().map(p -> {
            var permission = new Permission();
            permission.setId(p.getId());
            permission.setName(p.getName());
            permission.setDescription(p.getDescription());
            permission.setActive(p.isActive());
            return permission;
        }).toList();
        var response = new PermissionServiceResponse();
        response.setPermissions(permissions);
        return response;
    }
}
