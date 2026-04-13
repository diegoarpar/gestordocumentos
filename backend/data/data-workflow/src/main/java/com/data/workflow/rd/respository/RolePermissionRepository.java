package com.data.workflow.rd.respository;

import com.data.workflow.rd.model.RolePermissionInformation;
import org.springframework.data.repository.CrudRepository;

import java.util.UUID;

public interface RolePermissionRepository extends CrudRepository<RolePermissionInformation, UUID> {
}
