package com.itec.api.authentication.services;

import com.data.user.model.CredentialInformation;
import com.data.user.model.RoleInformation;
import com.data.user.model.UserInformation;
import com.data.user.service.UserServiceRepository;
import com.itec.api.authentication.model.UserAuthenticationServiceRequest;
import com.itec.api.authentication.model.UserAuthenticationServiceResponse;
import com.itec.utilities.service.BaseService;
import org.springframework.stereotype.Service;

/**
 * Create a user
 *
 * @author diegoarpar
 */
@Service
public class CreateUserAuthenticationService implements BaseService<UserAuthenticationServiceRequest, UserAuthenticationServiceResponse> {

    /**
     * The user repository
     */
    private final UserServiceRepository userServiceRepository;

    /**
     * The service repository.
     *
     * @param userServiceRepository the user repository.
     */
    public CreateUserAuthenticationService(UserServiceRepository userServiceRepository) {
        this.userServiceRepository = userServiceRepository;
    }

    /**
     * Execute the service
     * @param information the information
     */
    @Override
    public UserAuthenticationServiceResponse execute(UserAuthenticationServiceRequest information) {
        var roles = information.getUser().getRoles().stream().map(role ->
            RoleInformation.builder().id(role.getId()).name(role.getName()).build()
        ).toList();

        var credentials = information.getUser().getCredentials().stream().map(credential ->
                CredentialInformation.builder().id(credential.getId()).value(credential.getName()).build()).toList();
        var userModel = UserInformation.builder().active(true).name(information.getUser().getName()).roleModelList(roles).passwordModels(credentials).build();
        userServiceRepository.save(userModel);
        return new UserAuthenticationServiceResponse();
    }
}
