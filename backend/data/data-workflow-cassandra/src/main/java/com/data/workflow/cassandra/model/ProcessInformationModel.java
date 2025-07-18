package com.data.workflow.cassandra.model;

import org.springframework.data.cassandra.core.mapping.Column;
import org.springframework.data.cassandra.core.mapping.PrimaryKey;
import org.springframework.data.cassandra.core.mapping.Table;

@Table(value = "process")
public record ProcessInformationModel (
    @PrimaryKey("user_id") Long id,
    @Column String name

){
}
