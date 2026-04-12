package com.data.workflow.rd.respository;

import com.data.workflow.rd.model.GroupInformation;
import org.springframework.data.repository.CrudRepository;

import java.util.UUID;

public interface GroupRepository extends CrudRepository<GroupInformation, UUID>, CustomSave<GroupInformation> {
    GroupInformation findByName(String name);
}
