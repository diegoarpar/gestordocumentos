package com.data.workflow.mongo.respository;

import com.data.workflow.mongo.model.ProcessModel;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProcessRepository extends CrudRepository<ProcessModel, Long>{
    ProcessModel findByName(String name);
}
