package com.data.workflow.cassandra.model;

import lombok.Data;
import org.springframework.data.cassandra.core.mapping.Column;
import org.springframework.data.cassandra.core.mapping.PrimaryKey;
import org.springframework.data.cassandra.core.mapping.Table;

import java.util.UUID;

@Data
@Table(value = "process")
public class ProcessInformation{
    @PrimaryKey("id")
    UUID id;
    @Column String name;
    @Column String description;
    @Column boolean active;

}
