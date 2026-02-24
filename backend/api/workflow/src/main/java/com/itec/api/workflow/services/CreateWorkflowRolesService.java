package com.itec.api.workflow.services;

import com.data.workflow.cassandra.model.RoleInformation;
import com.data.workflow.cassandra.service.RoleServiceRepository;
import com.itec.api.workflow.model.RoleServiceRequest;
import com.itec.api.workflow.model.RoleServiceResponse;
import com.itec.utilities.service.BaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CreateWorkflowRolesService implements BaseService<RoleServiceRequest, RoleServiceResponse> {

    private final RoleServiceRepository roleServiceRepository;

    @Override
    public RoleServiceResponse execute(RoleServiceRequest information) {
        var roleInformation = new RoleInformation();
        roleInformation.setId(UUID.randomUUID());
        roleInformation.setName(information.getName());
        roleServiceRepository.save(roleInformation);
        return new RoleServiceResponse();
    }
}
