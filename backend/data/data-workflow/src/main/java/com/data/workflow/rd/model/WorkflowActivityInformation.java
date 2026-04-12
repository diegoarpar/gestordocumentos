package com.data.workflow.rd.model;

import lombok.Data;
import org.springframework.data.cassandra.core.mapping.PrimaryKeyColumn;
import org.springframework.data.cassandra.core.mapping.Table;

import java.util.UUID;

import static org.springframework.data.cassandra.core.cql.PrimaryKeyType.PARTITIONED;

@Data
@Table(value = "workflow_activity")
public class WorkflowActivityInformation {

    @PrimaryKeyColumn(name = "id", type = PARTITIONED)
    UUID id;

    @PrimaryKeyColumn(name = "workflowId", type = PARTITIONED)
    UUID workflowId;

    @PrimaryKeyColumn(name = "activityId", type = PARTITIONED)
    UUID activityId;
}
