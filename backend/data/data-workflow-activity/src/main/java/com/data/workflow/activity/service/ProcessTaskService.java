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

        List<Task> taks = new ArrayList<>(taskService.createTaskQuery().taskId(taskId).list());
        for (int i = 0; i < taks.size(); i++) {
            Map<String, Object> item = new HashMap<>();
            org.activiti.engine.task.Task task = taks.get(i);
            item.put(ProcessInformation.TASK_NAME.name(), task.getName());
            item.put(ProcessInformation.TASK_ID.name(),task.getId());
            item.put(ProcessInformation.INSTANCE_ID.name(),task.getProcessInstanceId());
            item.put(ProcessInformation.TASK_DUE_DATE.name(),task.getDueDate());
            item.put(ProcessInformation.TASK_PRIORITY.name(),task.getPriority() + "");
            item.put(ProcessInformation.USER_NAME.name(),task.getAssignee());

            rta.add(item);
        }
        processEngine.close();
        return rta;
    }
    public List<Map<String, Object>> getTask(String tenant, String user, List<String> roles) {
        ProcessEngine processEngine = processEngineMap.get(tenant);
        List<Map<String, Object>> rta = new ArrayList<Map<String, Object>>();
        Map<String,Object> inputValues = new HashMap<String,Object>();
        TaskService taskService = processEngine.getTaskService();

        List<Task> taks = new ArrayList<>(taskService.createTaskQuery().taskAssignee(user).list());
        for (int i=0;i < roles.size(); i++) {
            String role= roles.get(i);
            taks.addAll(taskService.createTaskQuery()
                    .taskCandidateGroup(role).list());
        }
        for (int i = 0; i < taks.size(); i++) {
            Map<String, Object> item = new HashMap<>();
            org.activiti.engine.task.Task task = taks.get(i);
            item.put(ProcessInformation.TASK_NAME.name(), task.getName());
            item.put(ProcessInformation.TASK_ID.name(),task.getId());
            item.put(ProcessInformation.INSTANCE_ID.name(),task.getProcessInstanceId());
            item.put(ProcessInformation.TASK_DUE_DATE.name(),task.getDueDate());
            item.put(ProcessInformation.TASK_PRIORITY.name(),task.getPriority() + "");
            item.put(ProcessInformation.USER_NAME.name(),task.getAssignee());

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
