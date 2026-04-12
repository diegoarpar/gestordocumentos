package com.data.workflow.rd.respository;

import com.data.workflow.rd.model.WorkflowInformation;
import org.springframework.data.repository.CrudRepository;

import java.util.UUID;

public interface WorkflowRepository extends CrudRepository<WorkflowInformation, UUID> {

    WorkflowInformation findByName(String name);
    WorkflowInformation findById(String id);
    WorkflowInformation findByLatestKeyName(String lastKeyName);
}
