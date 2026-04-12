package com.data.workflow.cassandra.service;

import com.data.workflow.cassandra.model.TaskAction;
import com.data.workflow.cassandra.model.TaskLogInformation;
import com.data.workflow.cassandra.respository.TaskLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Audit log for workflow task actions (assign, claim, finish).
 *
 * @author diegoarpar
 */
@Service
@RequiredArgsConstructor
public class TaskLogServiceRepository {

    private final TaskLogRepository repository;

    public List<TaskLogInformation> findAll() {
        var results = new ArrayList<TaskLogInformation>();
        repository.findAll().forEach(results::add);
        return results;
    }

    private void log(String taskId, String instanceId, String userName, TaskAction action) {
        var entry = new TaskLogInformation();
        entry.setId(UUID.randomUUID());
        entry.setTaskId(taskId);
        entry.setInstanceId(instanceId);
        entry.setUserName(userName);
        entry.setAction(action.name());
        entry.setTimestamp(Instant.now());
        repository.save(entry);
    }
}
