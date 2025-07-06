package com.itec.workflowmanager.service;

import org.activiti.engine.ActivitiIllegalArgumentException;
import org.activiti.engine.ProcessEngine;
import org.activiti.engine.RepositoryService;
import org.activiti.engine.RuntimeService;
import org.activiti.engine.repository.ProcessDefinition;
import org.activiti.engine.runtime.ProcessInstance;
import org.activiti.image.impl.DefaultProcessDiagramGenerator;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.util.Base64;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Service
public class ProcessInstanceService {
    Map<String, ProcessEngine> processEngineMap;
    public ProcessInstanceService(@Qualifier("processEngine") Map<String, ProcessEngine> processEngineMap) {
        this.processEngineMap = processEngineMap;
    }

    public void initProcessInstance(String tenant, Map<String, String> processInformation, Map<String, String> instanceInformation) {
        ProcessEngine processEngine = processEngineMap.get(tenant);
        String initialStatus="RECIBIDO";
        String action= "init";
        Map<String, Object> inputValues = new HashMap<>(processInformation);
        inputValues.put("tenant", tenant);
        inputValues.put("processInstanceStatus", initialStatus);
        inputValues.put("user",(processInformation.get("requester")));
        RuntimeService runtimeService = processEngine.getRuntimeService();
        ProcessInstance processInstance = runtimeService
                .startProcessInstanceByKey(processInformation.get("workflowName"), inputValues);
        System.out.println("Onboarding process started with process instance id ["
                + processInstance.getProcessInstanceId()
                + "] key [" + processInstance.getProcessDefinitionKey() + "]");

        processEngine.close();
    }

    public String getProcessInstanceDiagram(String tenant, String processInstanceId) throws IOException {
        ProcessEngine processEngine = processEngineMap.get(tenant);

        RuntimeService runtimeService = processEngine.getRuntimeService();

        ProcessInstance processInstance = runtimeService.createProcessInstanceQuery()
                .processInstanceId(processInstanceId).singleResult();

        RepositoryService repositoryService = processEngine.getRepositoryService();
        ProcessDefinition pde = repositoryService.getProcessDefinition(processInstance.getProcessDefinitionId());

        if (pde != null && pde.hasGraphicalNotation()) {

            InputStream diagramStream = new DefaultProcessDiagramGenerator()
                    .generateDiagram(
                            repositoryService.getBpmnModel(pde.getId()),
                            runtimeService.getActiveActivityIds(processInstanceId)
                    );
            try {
                return Base64.getEncoder().encodeToString(IOUtils.toByteArray(diagramStream));

            } catch (Exception e) {
                throw new ActivitiIllegalArgumentException("Error exporting diagram", e);
            }

        } else {
            throw new ActivitiIllegalArgumentException("Process instance with id '" + processInstance.getId()
                    + "' has no graphical notation defined.");
        }
    }
}
