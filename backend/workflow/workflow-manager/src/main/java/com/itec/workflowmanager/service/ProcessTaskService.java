package com.itec.workflowmanager.service;

import com.mongodb.BasicDBObject;
import org.activiti.engine.*;
import org.activiti.engine.task.Task;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.*;

@Service
public class ProcessTaskService {
    Map<String, ProcessEngine> processEngineMap;
    public ProcessTaskService(@Qualifier("processEngine") Map<String, ProcessEngine> processEngineMap) {
        this.processEngineMap = processEngineMap;
    }

    public List<Map<String, String>> getTask(String tenant, String user, List<String> roles) {
        ProcessEngine processEngine = processEngineMap.get(tenant);
        List<Map<String, String>> rta = new ArrayList<Map<String, String>>();
        Map<String,Object> inputValues = new HashMap<String,Object>();
        TaskService taskService = processEngine.getTaskService();

        List<Task> taks = new ArrayList<>(taskService.createTaskQuery().taskAssignee(user).list());
        for (int i=0;i < roles.size(); i++) {
            String role= roles.get(i);
            taks.addAll(taskService.createTaskQuery()
                    .taskCandidateGroup(role).list());
        }
        for (int i = 0; i < taks.size(); i++) {
            Map<String, String> item = new HashMap<>();
            org.activiti.engine.task.Task task = taks.get(i);
            BasicDBObject criterial2 =new BasicDBObject().append("processInstanceId",task.getProcessInstanceId());
            String processName="NoNAME";
            String workflowName="NoNAME";
            String requestNumber="";
            String processInstanceStatus="";
            item.put("taskDescription",task.getName());
            item.put("taskId",task.getId());
            item.put("taskName",task.getTaskDefinitionKey());
            item.put("processInstance",task.getProcessInstanceId());
            item.put("dueDate",task.getDueDate().toString());
            item.put("processDefKey",task.getProcessDefinitionId());
            item.put("priority",task.getPriority() + "");
            item.put("assign",task.getAssignee());
            item.put("processName",processName);
            item.put("workflowName",workflowName);
            item.put("processInstanceId",task.getProcessInstanceId());
            item.put("requestNumber",requestNumber);
            item.put("processInstanceStatus",processInstanceStatus);

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

    public void assign(String tenant, String taskId, String userId) throws IOException {
        ProcessEngine processEngine = processEngineMap.get(tenant);
        TaskService taskService = processEngine.getTaskService();
        taskService.setAssignee(taskId, userId);
    }
}
