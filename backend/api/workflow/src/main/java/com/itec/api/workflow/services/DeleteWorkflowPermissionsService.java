package com.itec.api.workflow.services;

import com.data.workflow.cassandra.service.PermissionServiceRepository;
import com.itec.api.workflow.model.PermissionServiceRequest;
import com.itec.api.workflow.model.PermissionServiceResponse;
import com.itec.utilities.service.BaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DeleteWorkflowPermissionsService implements BaseService<PermissionServiceRequest, PermissionServiceResponse> {

    private final PermissionServiceRepository permissionServiceRepository;

    @Override
    public PermissionServiceResponse execute(PermissionServiceRequest information) {
        permissionServiceRepository.deleteById(UUID.fromString(information.getId()));
        return new PermissionServiceResponse();
    }
}
