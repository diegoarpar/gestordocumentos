package com.data.workflow.cassandra.model;

import lombok.Data;
import org.springframework.data.cassandra.core.mapping.PrimaryKeyColumn;
import org.springframework.data.cassandra.core.mapping.Table;

import java.util.UUID;

import static org.springframework.data.cassandra.core.cql.PrimaryKeyType.PARTITIONED;

@Data
@Table(value = "role_permission")
public class RolePermissionInformation {

    @PrimaryKeyColumn(name = "id", type = PARTITIONED)
    UUID id;

    @PrimaryKeyColumn(name = "roleId", type = PARTITIONED)
    UUID roleId;

    @PrimaryKeyColumn(name = "permissionId", type = PARTITIONED)
    UUID permissionId;

}
