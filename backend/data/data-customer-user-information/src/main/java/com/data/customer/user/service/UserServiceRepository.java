package com.data.customer.user.service;

import com.data.customer.user.model.UserModel;
import com.data.customer.user.respository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserServiceRepository {

    UserRepository repository;


    public UserServiceRepository(UserRepository repository) {
        this.repository = repository;
    }

    public UserModel save(UserModel model) {
        return repository.save(model);
    }
}
