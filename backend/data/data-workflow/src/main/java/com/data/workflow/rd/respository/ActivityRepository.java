package com.data.workflow.rd.respository;

import com.data.workflow.rd.model.ActivityInformation;
import org.springframework.data.repository.CrudRepository;

import java.util.UUID;

public interface ActivityRepository extends CrudRepository<ActivityInformation, UUID> {

    ActivityInformation findByName(String name);
    ActivityInformation findByKeyName(String keyName);
}
