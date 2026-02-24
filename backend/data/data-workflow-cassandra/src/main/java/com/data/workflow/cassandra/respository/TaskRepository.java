package com.data.workflow.cassandra.respository;

import com.data.workflow.cassandra.model.TaskInformation;
import org.springframework.data.repository.CrudRepository;

import java.util.UUID;

public interface TaskRepository extends CrudRepository<TaskInformation, UUID> {
    TaskInformation findByName(String name);
}
