package com.data.workflow.rd.respository;

import com.data.workflow.rd.model.TaskInformation;
import org.springframework.data.repository.CrudRepository;

import java.util.UUID;

public interface TaskRepository extends CrudRepository<TaskInformation, UUID> {
    TaskInformation findByName(String name);
}
