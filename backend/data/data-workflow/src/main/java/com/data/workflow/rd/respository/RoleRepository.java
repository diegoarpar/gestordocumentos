package com.data.workflow.rd.respository;

import com.data.workflow.rd.model.RoleInformation;
import org.springframework.data.repository.CrudRepository;

import java.util.UUID;

public interface RoleRepository extends CrudRepository<RoleInformation, UUID>, CustomSave<RoleInformation> {
    RoleInformation findByName(String name);

}
