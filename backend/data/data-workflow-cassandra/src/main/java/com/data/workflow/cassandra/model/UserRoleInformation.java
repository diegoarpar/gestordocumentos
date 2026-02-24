package com.data.workflow.cassandra.model;

import lombok.Data;
import org.springframework.data.cassandra.core.mapping.PrimaryKeyColumn;
import org.springframework.data.cassandra.core.mapping.Table;

import java.util.UUID;

import static org.springframework.data.cassandra.core.cql.PrimaryKeyType.PARTITIONED;

@Data
@Table(value = "user_role")
public class UserRoleInformation {

    @PrimaryKeyColumn(name = "id", type = PARTITIONED)
    UUID id;

    @PrimaryKeyColumn(name = "userName", type = PARTITIONED)
    String userName;

    @PrimaryKeyColumn(name = "roleId", type = PARTITIONED)
    UUID roleId;

}
