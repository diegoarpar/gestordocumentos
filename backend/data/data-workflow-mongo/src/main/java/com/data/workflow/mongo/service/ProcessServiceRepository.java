package com.data.workflow.mongo.service;

import com.data.workflow.mongo.model.ProcessModel;
import com.data.workflow.mongo.respository.ProcessRepository;
import org.springframework.stereotype.Service;

@Service
public class ProcessServiceRepository {

    ProcessRepository repository;


    public ProcessServiceRepository(ProcessRepository repository) {
        this.repository = repository;
    }

    public ProcessModel save(ProcessModel model) {
        return repository.save(model);
    }
}
