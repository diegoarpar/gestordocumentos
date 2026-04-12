package com.data.workflow.rd.respository;

import com.data.workflow.rd.model.WorkflowDeploymentInformation;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.UUID;

public interface WorkflowDeploymentRepository extends CrudRepository<WorkflowDeploymentInformation, UUID> {

    List<WorkflowDeploymentInformation> findByWorkflowId(UUID workflowId);

    List<WorkflowDeploymentInformation> findByDeployedBy(String deployedBy);
}
