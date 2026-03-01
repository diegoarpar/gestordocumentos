package com.itec.api.workflow.services;

import com.data.workflow.cassandra.service.RoleServiceRepository;
import com.itec.api.workflow.model.RoleServiceRequest;
import com.itec.api.workflow.model.RoleServiceResponse;
import com.itec.utilities.service.BaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DeleteWorkflowRolesService implements BaseService<RoleServiceRequest, RoleServiceResponse> {

    private final RoleServiceRepository roleServiceRepository;

    @Override
    public RoleServiceResponse execute(RoleServiceRequest information) {
        roleServiceRepository.deleteById(UUID.fromString(information.getId()));
        return new RoleServiceResponse();
    }
}