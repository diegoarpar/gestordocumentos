package com.itec.workflowmanager.service;

import com.itec.utilities.service.BaseService;
import com.itec.workflowmanager.model.ProcessDefinitionServiceRequest;
import com.itec.workflowmanager.model.ProcessDefinitionServiceResponse;
import org.activiti.engine.ProcessEngine;
import org.activiti.engine.RuntimeService;
import org.activiti.engine.runtime.ProcessInstance;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service(ProcessServiceName.INIT_INSTANCE)
public class ProcessInitInstanceService implements BaseService<ProcessDefinitionServiceRequest, ProcessDefinitionServiceResponse> {
    Map<String, ProcessEngine> processEngineMap;
    public ProcessInitInstanceService(@Qualifier("processEngine") Map<String, ProcessEngine> processEngineMap) {
        this.processEngineMap = processEngineMap;
    }

    @Override
    public ProcessDefinitionServiceResponse execute(ProcessDefinitionServiceRequest information) {
        ProcessEngine processEngine = processEngineMap.get(information.getTenant());
        String initialStatus="RECIBIDO";
        String action= "init";
        Map<String, Object> inputValues = new HashMap<>(information.getProcessInformation());
        inputValues.put("tenant", information.getTenant());
        inputValues.put("processInstanceStatus", initialStatus);
        inputValues.put("user",(information.getProcessInformation().get("requester")));
        RuntimeService runtimeService = processEngine.getRuntimeService();
        ProcessInstance processInstance = runtimeService
                .startProcessInstanceByKey(information.getProcessInformation().get("workflowName"), inputValues);
        System.out.println("Onboarding process started with process instance id ["
                + processInstance.getProcessInstanceId()
                + "] key [" + processInstance.getProcessDefinitionKey() + "]");

        processEngine.close();
        return null;
    }
}
