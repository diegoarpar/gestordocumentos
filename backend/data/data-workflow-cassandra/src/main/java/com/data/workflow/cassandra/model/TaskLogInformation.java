package com.data.workflow.cassandra.model;

import lombok.Data;
import org.springframework.data.cassandra.core.mapping.Column;
import org.springframework.data.cassandra.core.mapping.PrimaryKey;
import org.springframework.data.cassandra.core.mapping.Table;

import java.time.Instant;
import java.util.UUID;

@Data
@Table(value = "task_log")
public class TaskLogInformation {

    @PrimaryKey("id")
    private UUID id;

    @Column("task_id")
    private String taskId;

    @Column("instance_id")
    private String instanceId;

    @Column("user_name")
    private String userName;

    @Column("action")
    private String action;

    @Column("timestamp")
    private Instant timestamp;
}
