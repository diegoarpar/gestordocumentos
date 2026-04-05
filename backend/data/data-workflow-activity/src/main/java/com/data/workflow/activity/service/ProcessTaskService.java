package com.data.workflow.activity.service;

import com.data.workflow.activity.model.ProcessInformation;
import org.activiti.engine.ProcessEngine;
import org.activiti.engine.TaskService;
import org.activiti.engine.task.Task;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ProcessTaskService {
    Map<String, ProcessEngine> processEngineMap;
    public ProcessTaskService(@Qualifier("processEngine") Map<String, ProcessEngine> processEngineMap) {
        this.processEngineMap = processEngineMap;
    }

    public List<Map<String, Object>> getTask(String tenant, String taskId) {
        ProcessEngine processEngine = processEngineMap.get(tenant);
        List<Map<String, Object>> rta = new ArrayList<Map<String, Object>>();
        Map<String,Object> inputValues = new HashMap<String,Object>();
        TaskService taskService = processEngine.getTaskService();

        List<Task> tasks = new ArrayList<>(taskService.createTaskQuery().taskId(taskId).list());
        for (Task task : tasks) {
            Map<String, Object> item = new HashMap<>();
            item.put(ProcessInformation.TASK_NAME.name(), task.getName());
            item.put(ProcessInformation.TASK_ID.name(), task.getId());
            item.put(ProcessInformation.TASK_DEFINITION_KEY.name(), task.getTaskDefinitionKey());
            item.put(ProcessInformation.PROCESS_DEFINITION_ID.name(), task.getProcessDefinitionId());
            item.put(ProcessInformation.INSTANCE_ID.name(), task.getProcessInstanceId());
            item.put(ProcessInformation.TASK_DUE_DATE.name(), task.getDueDate());
            item.put(ProcessInformation.TASK_PRIORITY.name(), task.getPriority() + "");
            item.put(ProcessInformation.USER_NAME.name(), task.getAssignee());
            rta.add(item);
        }
        processEngine.close();
        return rta;
    }
    public List<Map<String, Object>> getTask(String tenant, String user, List<String> roles) {
        var processEngine = processEngineMap.get(tenant);
        List<Map<String, Object>> rta = new ArrayList<Map<String, Object>>();
        Map<String,Object> inputValues = new HashMap<String,Object>();
        TaskService taskService = processEngine.getTaskService();

        var tasks = new ArrayList<>(taskService.createTaskQuery().taskCandidateOrAssigned(user).list());
        for (String role : roles) {
            var candidateGroupTask = taskService.createTaskQuery()
                    .taskCandidateGroup(role).list();
            tasks.addAll(candidateGroupTask);
        }
        for (Task task : tasks) {
            Map<String, Object> item = new HashMap<>();
            item.put(ProcessInformation.TASK_NAME.name(), task.getName());
            item.put(ProcessInformation.TASK_ID.name(), task.getId());
            item.put(ProcessInformation.TASK_DEFINITION_KEY.name(), task.getTaskDefinitionKey());
            item.put(ProcessInformation.INSTANCE_ID.name(), task.getProcessInstanceId());
            item.put(ProcessInformation.TASK_DUE_DATE.name(), task.getDueDate());
            item.put(ProcessInformation.TASK_PRIORITY.name(), task.getPriority() + "");
            item.put(ProcessInformation.USER_NAME.name(), task.getAssignee());
            item.put(ProcessInformation.PROCESS_DEFINITION_ID.name(), task.getProcessDefinitionId());

            rta.add(item);
        }
        processEngine.close();
        return rta;
    }

    public void completeTask(String tenant, String taskId, String user, Map<String, Object> processInformation) {
        ProcessEngine processEngine = processEngineMap.get(tenant);
        TaskService taskService = processEngine.getTaskService();
        taskService.setAssignee(taskId, user);
        taskService.complete(taskId, processInformation);
    }

    public void assign(String tenant, String taskId, String userId) {
        ProcessEngine processEngine = processEngineMap.get(tenant);
        TaskService taskService = processEngine.getTaskService();
        taskService.setAssignee(taskId, userId);
    }
}
