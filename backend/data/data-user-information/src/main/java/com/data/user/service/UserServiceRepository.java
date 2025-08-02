package com.data.user.service;

import com.data.user.model.UserModel;
import com.data.user.respository.UserRepository;
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
