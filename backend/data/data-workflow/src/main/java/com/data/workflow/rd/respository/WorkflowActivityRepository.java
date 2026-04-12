package com.data.workflow.rd.respository;

import com.data.workflow.rd.model.WorkflowActivityInformation;
import org.springframework.data.repository.CrudRepository;

import java.util.UUID;

public interface WorkflowActivityRepository extends CrudRepository<WorkflowActivityInformation, UUID> {
}
