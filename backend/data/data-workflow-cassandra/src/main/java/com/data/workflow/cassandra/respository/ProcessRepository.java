package com.data.workflow.cassandra.respository;

import com.data.workflow.cassandra.model.ProcessInformationModel;
import org.springframework.data.repository.CrudRepository;

import java.util.UUID;

public interface ProcessRepository extends CrudRepository<ProcessInformationModel, UUID>, CustomSave<ProcessInformationModel> {
    ProcessInformationModel findByName(String name);

}
