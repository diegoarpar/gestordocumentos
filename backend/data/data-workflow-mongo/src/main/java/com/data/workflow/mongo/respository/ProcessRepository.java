package com.data.workflow.mongo.respository;

import com.data.workflow.mongo.model.ProcessInformationModel;
import org.springframework.data.repository.CrudRepository;

public interface ProcessRepository extends CrudRepository<ProcessInformationModel, Long>{
    ProcessInformationModel findByName(String name);

}
