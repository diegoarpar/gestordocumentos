package com.data.authorization.service;

import com.data.authorization.model.DataAuthorizationModel;
import com.data.authorization.respository.DataAuthorizationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ServiceAuthorizationRepository {

    DataAuthorizationRepository repository;


    public ServiceAuthorizationRepository(DataAuthorizationRepository repository) {
        this.repository = repository;
    }

    public DataAuthorizationModel save(DataAuthorizationModel model) {
        return repository.save(model);
    }

    public DataAuthorizationModel readByName(DataAuthorizationModel model) {
        return null;
    }

    public DataAuthorizationModel readByOrigin(DataAuthorizationModel model) {
        return null;
    }

    public List<DataAuthorizationModel> readAll(DataAuthorizationModel model) {
        return (List<DataAuthorizationModel>) repository.findAll();
    }
}
