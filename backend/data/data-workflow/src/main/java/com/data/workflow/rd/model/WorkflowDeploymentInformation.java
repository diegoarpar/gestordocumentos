package com.data.workflow.rd.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Data
@Entity
public class WorkflowDeploymentInformation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private UUID workflowId;

    private String fileName;

    private String filePath;

    private String deployedBy;
    private String status;

    private Instant timestamp;
}
