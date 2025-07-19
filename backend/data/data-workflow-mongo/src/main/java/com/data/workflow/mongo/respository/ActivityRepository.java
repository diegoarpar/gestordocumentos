package com.data.workflow.mongo.respository;

import com.data.workflow.mongo.model.ActivityModel;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ActivityRepository extends CrudRepository<ActivityModel, Long> {
    ActivityModel findByName(String name);
}
