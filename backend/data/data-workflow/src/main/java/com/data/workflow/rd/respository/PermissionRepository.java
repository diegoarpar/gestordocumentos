package com.data.workflow.rd.respository;

import com.data.workflow.rd.model.PermissionInformation;
import org.springframework.data.repository.CrudRepository;

import java.util.UUID;

public interface PermissionRepository extends CrudRepository<PermissionInformation, UUID> {
    PermissionInformation findByName(String name);
}
