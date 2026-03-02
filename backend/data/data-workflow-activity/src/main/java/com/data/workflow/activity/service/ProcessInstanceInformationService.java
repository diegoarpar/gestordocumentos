package com.data.workflow.activity.service;

import com.data.workflow.activity.model.ProcessDefinitionRequest;
import com.data.workflow.activity.model.ProcessDefinitionResponse;
import com.data.workflow.activity.model.ProcessInformation;
import org.activiti.engine.ProcessEngine;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ProcessInstanceInformationService {
    Map<String, ProcessEngine> processEngineMap;
    public ProcessInstanceInformationService(@Qualifier("processEngine") Map<String, ProcessEngine> processEngineMap) {
        this.processEngineMap = processEngineMap;
    }

    public ProcessDefinitionResponse execute(ProcessDefinitionRequest information) {
        var processEngine = processEngineMap.get(information.getTenant());
        var processInstance = processEngine.getHistoryService()
                .createHistoricProcessInstanceQuery()
                .processInstanceId(information.getInstanceId())
                .list();
        var tasks = processEngine.getHistoryService().createHistoricTaskInstanceQuery()
                .processInstanceId(information.getInstanceId())
                .list();
        System.out.println("Onboarding process started with process instance taskId ["
                + processInstance.getFirst().getStartActivityId()
                + "] action [" + processInstance.getFirst().getStartUserId() + "]");

        var response = new ProcessDefinitionResponse();
        List<Map<String, Object>> taskInformation = new ArrayList<>();
        tasks.forEach(task -> {
            Map<String, Object> taskInfo = new HashMap<>();
            taskInfo.put(ProcessInformation.TASK_NAME.name(), task.getName());
            taskInfo.put(ProcessInformation.TASK_ID.name(), task.getId());
            taskInfo.put(ProcessInformation.USER_NAME.name(), task.getOwner());
            taskInfo.put(ProcessInformation.TASK_CLAIM_TIME.name(), task.getClaimTime());
            taskInfo.put(ProcessInformation.TASK_END_TIME.name(), task.getEndTime());
            taskInformation.add(taskInfo);
        });
        var instanceInformation = processInstance.getFirst();

        var processInformation = new HashMap<String, String>();
        processInformation.put(ProcessInformation.INSTANCE_ID.name(), instanceInformation.getId());
        response.setInformation(processInformation);
        response.setTaskInformation(taskInformation);
        processEngine.close();
        return response;
    }
}

