package com.itec.api.authentication.services;

import com.data.user.model.RoleInformation;
import com.data.user.service.RoleServiceRepository;
import com.itec.api.authentication.model.RoleAuthenticationServiceRequest;
import com.itec.api.authentication.model.RoleAuthenticationServiceResponse;
import com.itec.utilities.service.BaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * Create a role.
 *
 * @author diegoarpar
 */
@Service
@RequiredArgsConstructor
public class CreateRoleAuthenticationService implements BaseService<RoleAuthenticationServiceRequest, RoleAuthenticationServiceResponse> {

    /**
     * The role repository
     */
    private final RoleServiceRepository roleServiceRepository;

    /**
     * Execute the service.
     *
     * @param information the information
     */
    @Override
    public RoleAuthenticationServiceResponse execute(RoleAuthenticationServiceRequest information) {
        var role = RoleInformation.builder().active(true).name(information.getRole().getName()).build();
        roleServiceRepository.save(role);
        return new RoleAuthenticationServiceResponse();
    }
}
