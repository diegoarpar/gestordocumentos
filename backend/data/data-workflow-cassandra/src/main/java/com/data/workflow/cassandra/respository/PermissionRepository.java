package com.data.workflow.cassandra.respository;

import com.data.workflow.cassandra.model.PermissionInformation;
import org.springframework.data.repository.CrudRepository;

import java.util.UUID;

public interface PermissionRepository extends CrudRepository<PermissionInformation, UUID>, CustomSave<PermissionInformation> {
    PermissionInformation findByName(String name);
}
