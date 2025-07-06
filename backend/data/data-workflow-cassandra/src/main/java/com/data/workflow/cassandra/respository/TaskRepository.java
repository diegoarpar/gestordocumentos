package com.data.workflow.cassandra.respository;

import com.data.workflow.cassandra.model.TaskInformationModel;
import org.springframework.data.repository.CrudRepository;

import java.util.UUID;

public interface TaskRepository extends CrudRepository<TaskInformationModel, UUID> {
    TaskInformationModel findByName(String name);
}
