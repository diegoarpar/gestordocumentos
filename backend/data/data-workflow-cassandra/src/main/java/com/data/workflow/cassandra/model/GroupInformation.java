package com.data.workflow.cassandra.model;

import lombok.Data;
import org.springframework.data.cassandra.core.mapping.Column;
import org.springframework.data.cassandra.core.mapping.PrimaryKey;
import org.springframework.data.cassandra.core.mapping.Table;

import java.util.UUID;

@Data
@Table(value = "group")
public class GroupInformation {

    @PrimaryKey("id")
    private UUID id;

    @Column private String name;
    @Column private String description;
    @Column private boolean active;

}