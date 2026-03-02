package com.data.workflow.cassandra.respository;

import com.data.workflow.cassandra.model.TaskLogInformation;
import org.springframework.data.cassandra.repository.AllowFiltering;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.UUID;

public interface TaskLogRepository extends CrudRepository<TaskLogInformation, UUID> {

    @AllowFiltering
    List<TaskLogInformation> findByTaskId(String taskId);

    @AllowFiltering
    List<TaskLogInformation> findByTaskUserName(String userName);

    @AllowFiltering
    List<TaskLogInformation> findByInstanceId(String instanceId);
}
