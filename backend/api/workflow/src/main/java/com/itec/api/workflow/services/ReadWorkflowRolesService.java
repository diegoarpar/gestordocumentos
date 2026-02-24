package com.itec.api.workflow.services;

import com.data.workflow.cassandra.model.RoleInformation;
import com.data.workflow.cassandra.service.RoleServiceRepository;
import com.itec.api.workflow.model.RoleServiceRequest;
import com.itec.api.workflow.model.RoleServiceResponse;
import com.itec.utilities.service.BaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReadWorkflowRolesService implements BaseService<RoleServiceRequest, RoleServiceResponse> {

    private final RoleServiceRepository roleServiceRepository;

    @Override
    public RoleServiceResponse execute(RoleServiceRequest information) {
        var results = roleServiceRepository.find();
        var roles = results.stream().map(RoleInformation::getName).toList();
        var response = new RoleServiceResponse();
        response.setRoles(roles);
        return response;
    }
}
