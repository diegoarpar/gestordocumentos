package com.itec.api.authentication.services;

import com.data.user.model.RoleInformation;
import com.data.user.service.RoleServiceRepository;
import com.itec.api.authentication.model.RoleAuthenticationServiceRequest;
import com.itec.api.authentication.model.RoleAuthenticationServiceResponse;
import com.itec.utilities.service.BaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * Read Role.
 *
 * @author diegoarpar
 */
@Service
@RequiredArgsConstructor
public class ReadRoleAuthenticationService implements BaseService<RoleAuthenticationServiceRequest, RoleAuthenticationServiceResponse> {

    /**
     * The role repository
     */
    private final RoleServiceRepository roleServiceRepository;

    /**
     * Execute the service
     * @param information the information
     */
    @Override
    public RoleAuthenticationServiceResponse execute(RoleAuthenticationServiceRequest information) {
        var role = roleServiceRepository.find(RoleInformation.builder().name(information.getRole().getName()).build());
        var response = new RoleAuthenticationServiceResponse();
        response.setRole(new com.itec.api.authentication.model.Role());
        response.getRole().setName(role.getName());
        return response;
    }
}
