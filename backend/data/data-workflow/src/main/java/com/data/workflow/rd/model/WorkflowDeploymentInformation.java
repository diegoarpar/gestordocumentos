package com.data.workflow.rd.model;

import lombok.Data;
import org.springframework.data.cassandra.core.mapping.Column;
import org.springframework.data.cassandra.core.mapping.PrimaryKey;
import org.springframework.data.cassandra.core.mapping.Table;

import java.time.Instant;
import java.util.UUID;

@Data
@Table(value = "workflow_deployment")
public class WorkflowDeploymentInformation {

    @PrimaryKey("id")
    private UUID id;

    @Column("workflow_id")
    private UUID workflowId;

    @Column("file_name")
    private String fileName;

    @Column("file_path")
    private String filePath;

    @Column("deployed_by")
    private String deployedBy;

    @Column("status")
    private String status;

    @Column("timestamp")
    private Instant timestamp;
}
