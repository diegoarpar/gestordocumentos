package com.data.workflow.mongo.respository;

import com.data.workflow.mongo.model.TaskInformationModel;
import org.springframework.data.repository.CrudRepository;

public interface TaskRepository extends CrudRepository<TaskInformationModel, Long> {
    TaskInformationModel findByName(String name);
}
