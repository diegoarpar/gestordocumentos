package com.data.workflow.cassandra.model;

import lombok.Data;
import org.springframework.data.cassandra.core.mapping.PrimaryKeyColumn;
import org.springframework.data.cassandra.core.mapping.Table;

import java.util.UUID;

import static org.springframework.data.cassandra.core.cql.PrimaryKeyType.PARTITIONED;

@Data
@Table(value = "user_group")
public class UserGroupInformation {

    @PrimaryKeyColumn(name = "id", type = PARTITIONED)
    UUID id;

    @PrimaryKeyColumn(name = "userName", type = PARTITIONED)
    String userName;

    @PrimaryKeyColumn(name = "groupId", type = PARTITIONED)
    UUID groupId;

}
