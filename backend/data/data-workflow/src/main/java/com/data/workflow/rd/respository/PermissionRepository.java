package com.data.workflow.rd.respository;

import com.data.workflow.rd.model.PermissionInformation;
import org.springframework.data.repository.CrudRepository;

import java.util.UUID;

public interface PermissionRepository extends CrudRepository<PermissionInformation, UUID>, CustomSave<PermissionInformation> {
    PermissionInformation findByName(String name);
}
