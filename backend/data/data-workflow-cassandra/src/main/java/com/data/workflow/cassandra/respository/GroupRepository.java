package com.data.workflow.cassandra.respository;

import com.data.workflow.cassandra.model.GroupInformation;
import org.springframework.data.repository.CrudRepository;

import java.util.UUID;

public interface GroupRepository extends CrudRepository<GroupInformation, UUID>, CustomSave<GroupInformation> {
    GroupInformation findByName(String name);
}
