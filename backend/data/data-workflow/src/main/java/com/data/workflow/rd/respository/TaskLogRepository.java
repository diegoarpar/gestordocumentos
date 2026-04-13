package com.data.workflow.rd.respository;

import com.data.workflow.rd.model.TaskLogInformation;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.UUID;

public interface TaskLogRepository extends CrudRepository<TaskLogInformation, UUID> {

    List<TaskLogInformation> findByTaskId(String taskId);

    List<TaskLogInformation> findByUserName(String userName);

    List<TaskLogInformation> findByInstanceId(String instanceId);
}
