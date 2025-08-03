package com.data.tenant.service;

import com.data.tenant.model.TenantModel;
import com.data.tenant.respository.TenantRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TenantServiceRepository {

    TenantRepository repository;


    public TenantServiceRepository(TenantRepository repository) {
        this.repository = repository;
    }

    public TenantModel save(TenantModel model) {
        return repository.save(model);
    }

    public TenantModel readByName(TenantModel model) {
        return repository.findByName(model.getName());
    }

    public TenantModel readByOrigin(TenantModel model) {
        return repository.findByOrigin(model.getOrigin());
    }

    public List<TenantModel> readAll(TenantModel model) {
        return (List<TenantModel>) repository.findAll();
    }
}
