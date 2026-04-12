package com.data.workflow.rd.model;

import lombok.Data;
import lombok.ToString;
import org.springframework.data.cassandra.core.mapping.*;

import java.util.UUID;

@Data
@Table(value = "workflow")
@ToString
public class WorkflowInformation {

    @PrimaryKey
    UUID id;
    @Column String name;

    @Column
    @Indexed
    String latestKeyName;
    @Column String href;

    @Column String description;

    @Column boolean active;
}
