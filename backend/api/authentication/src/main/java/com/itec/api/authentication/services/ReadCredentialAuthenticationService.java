package com.itec.api.authentication.services;

import com.data.user.model.UserModel;
import com.data.user.service.UserServiceRepository;
import com.itec.api.authentication.model.Role;
import com.itec.api.authentication.model.User;
import com.itec.api.authentication.model.UserAuthenticationServiceRequest;
import com.itec.api.authentication.model.UserAuthenticationServiceResponse;
import com.itec.utilities.service.BaseService;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Create a user
 *
 * @author diegoarpar
 */
@Service
public class ReadUserAuthenticationService implements BaseService<UserAuthenticationServiceRequest, UserAuthenticationServiceResponse> {

    /**
     * The user repository
     */
    private final UserServiceRepository userServiceRepository;

    /**
     * The service repository.
     *
     * @param userServiceRepository the user repository.
     */
    public ReadUserAuthenticationService(UserServiceRepository userServiceRepository) {
        this.userServiceRepository = userServiceRepository;
    }

    /**
     * Execute the service
     * @param information the information
     */
    @Override
    public UserAuthenticationServiceResponse execute(UserAuthenticationServiceRequest information) {
        var userModel = UserModel.builder().name(information.getUser().getName()).build();
        userModel = userServiceRepository.find(userModel);
        var respone = new UserAuthenticationServiceResponse();
        respone.setUser(new User());
        var userResponse = respone.getUser();
        userResponse.setName(userModel.getName());
        userResponse.setRoles(List.of(new Role()));
        userResponse.getRoles().getFirst().setName(userModel.getRoleModelList().getFirst().getName());
        return respone;
    }
}
