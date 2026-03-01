package com.itec.api.workflow.services;

import com.data.workflow.cassandra.model.PermissionInformation;
import com.data.workflow.cassandra.service.PermissionServiceRepository;
import com.itec.api.workflow.model.PermissionServiceRequest;
import com.itec.api.workflow.model.PermissionServiceResponse;
import com.itec.utilities.service.BaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UpdateWorkflowPermissionsService implements BaseService<PermissionServiceRequest, PermissionServiceResponse> {

    private final PermissionServiceRepository permissionServiceRepository;

    @Override
    public PermissionServiceResponse execute(PermissionServiceRequest information) {
        var permission = new PermissionInformation();
        permission.setId(UUID.fromString(information.getId()));
        permission.setName(information.getName());
        permission.setDescription(information.getDescription());
        permission.setActive(information.isActive());
        permissionServiceRepository.save(permission);
        return new PermissionServiceResponse();
    }
}
