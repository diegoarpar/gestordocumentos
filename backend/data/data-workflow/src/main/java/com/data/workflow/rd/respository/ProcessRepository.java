package com.data.workflow.rd.respository;

import com.data.workflow.rd.model.ProcessInformation;
import org.springframework.data.repository.CrudRepository;

import java.util.UUID;

public interface ProcessRepository extends CrudRepository<ProcessInformation, UUID>, CustomSave<ProcessInformation> {
    ProcessInformation findByName(String name);

}
