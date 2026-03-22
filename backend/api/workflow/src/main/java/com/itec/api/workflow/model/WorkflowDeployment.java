package com.itec.api.workflow.model;

import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Data
public class WorkflowDeployment {
    private UUID id;
    private UUID workflowId;
    private String fileName;
    private String filePath;
    private String deployedBy;
    private String status;
    private Instant timestamp;
}
