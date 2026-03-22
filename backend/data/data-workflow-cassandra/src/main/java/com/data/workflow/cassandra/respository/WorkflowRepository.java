package com.data.workflow.cassandra.respository;

import com.data.workflow.cassandra.model.WorkflowInformation;
import org.springframework.data.repository.CrudRepository;

import java.util.UUID;

public interface WorkflowRepository extends CrudRepository<WorkflowInformation, UUID> {

    WorkflowInformation findByName(String name);
}
