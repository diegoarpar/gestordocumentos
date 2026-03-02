package com.data.workflow.activity.service;

import com.data.workflow.activity.model.ProcessDefinitionRequest;
import com.data.workflow.activity.model.ProcessDefinitionResponse;
import com.data.workflow.activity.model.ProcessInformation;
import org.activiti.engine.ProcessEngine;
import org.activiti.engine.RuntimeService;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class ProcessInitInstanceService {
    Map<String, ProcessEngine> processEngineMap;
    public ProcessInitInstanceService(@Qualifier("processEngine") Map<String, ProcessEngine> processEngineMap) {
        this.processEngineMap = processEngineMap;
    }

    public ProcessDefinitionResponse execute(ProcessDefinitionRequest information) {
        var processEngine = processEngineMap.get(information.getTenant());
        String initialStatus="RECIBIDO";
        String action= "init";
        Map<String, Object> inputValues = new HashMap<>(information.getProcessInformation());
        inputValues.put("tenant", information.getTenant());
        inputValues.put("processInstanceStatus", initialStatus);
        inputValues.put("user",(information.getProcessInformation().get(ProcessInformation.USER_NAME.name())));
        RuntimeService runtimeService = processEngine.getRuntimeService();
        var processInstance = runtimeService
                .startProcessInstanceByKey(information.getWorkflowName(), inputValues);
        System.out.println("Onboarding process started with process instance id ["
                + processInstance.getProcessInstanceId()
                + "] key [" + processInstance.getProcessDefinitionKey() + "]");

        var response = new ProcessDefinitionResponse();
        response.setId(processInstance.getProcessInstanceId());
        processEngine.close();
        return response;
    }
}
