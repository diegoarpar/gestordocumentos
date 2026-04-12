package com.data.workflow.cassandra.respository;

import com.data.workflow.cassandra.model.ProcessInformation;
import org.springframework.data.repository.CrudRepository;

import java.util.UUID;

public interface ProcessRepository extends CrudRepository<ProcessInformation, UUID>, CustomSave<ProcessInformation> {
    ProcessInformation findByName(String name);

}
