package com.itec.api.authentication.services;

import com.data.user.model.CredentialModel;
import com.data.user.model.RoleModel;
import com.data.user.model.UserModel;
import com.data.user.service.UserServiceRepository;
import com.itec.api.authentication.model.UserAuthenticationServiceRequest;
import com.itec.api.authentication.model.UserAuthenticationServiceResponse;
import com.itec.utilities.service.BaseService;
import org.springframework.stereotype.Service;

/**
 * Create a credential.
 *
 * @author diegoarpar
 */
@Service
public class CreateCredentialAuthenticationService implements BaseService<UserAuthenticationServiceRequest, UserAuthenticationServiceResponse> {

    /**
     * The user repository
     */
    private final UserServiceRepository userServiceRepository;

    /**
     * The service repository.
     *
     * @param userServiceRepository the user repository.
     */
    public CreateCredentialAuthenticationService(UserServiceRepository userServiceRepository) {
        this.userServiceRepository = userServiceRepository;
    }

    /**
     * Execute the service
     * @param information the information
     */
    @Override
    public UserAuthenticationServiceResponse execute(UserAuthenticationServiceRequest information) {
        var roles = information.getUser().getRoles().stream().map(role ->
            RoleModel.builder().name(role.getName()).build()
        ).toList();

        var credentials = information.getUser().getCredentials().stream().map(credential ->
                CredentialModel.builder().value(credential.getName()).build()).toList();
        var userModel = UserModel.builder().name(information.getUser().getName()).roleModelList(roles).passwordModels(credentials).build();
        userServiceRepository.save(userModel);
        return new UserAuthenticationServiceResponse();
    }
}
