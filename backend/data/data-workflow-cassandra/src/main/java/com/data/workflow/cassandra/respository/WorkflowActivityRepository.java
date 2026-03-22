package com.data.workflow.cassandra.respository;

import com.data.workflow.cassandra.model.WorkflowActivityInformation;
import org.springframework.data.repository.CrudRepository;

import java.util.UUID;

public interface WorkflowActivityRepository extends CrudRepository<WorkflowActivityInformation, UUID> {
}
