package com.data.workflow.cassandra.respository;

import com.data.workflow.cassandra.model.RolePermissionInformation;
import org.springframework.data.repository.CrudRepository;

import java.util.UUID;

public interface RolePermissionRepository extends CrudRepository<RolePermissionInformation, UUID> {
}
