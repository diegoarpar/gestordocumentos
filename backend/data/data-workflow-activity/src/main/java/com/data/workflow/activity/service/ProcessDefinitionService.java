package com.data.workflow.activity.service;

import com.data.workflow.activity.model.ProcessDefinitionRequest;
import com.data.workflow.activity.model.ProcessDefinitionResponse;
import org.activiti.engine.ProcessEngine;
import org.activiti.engine.RepositoryService;
import org.activiti.engine.repository.Deployment;
import org.activiti.engine.repository.ProcessDefinition;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class ProcessDefinitionService {

    Map<String, ProcessEngine> processEngineMap;
    public ProcessDefinitionService(@Qualifier("processEngine") Map<String, ProcessEngine> processEngineMap) {
        this.processEngineMap = processEngineMap;
    }

    public ProcessDefinitionResponse execute(ProcessDefinitionRequest information) {
        var pe = processEngineMap.get(information.getTenant());
        RepositoryService repositoryService = pe.getRepositoryService();
        Deployment deployment =  repositoryService.createDeployment()
                //.addClasspathResource(fileDetail.getFileName()).deploy();
                .addInputStream(information.getOriginalName(), information.getInputStream())
                .deploy();

        ProcessDefinition processDefinition = repositoryService.createProcessDefinitionQuery()
                .deploymentId(deployment.getId()).singleResult();
        System.out.println(
                "Found process definition ["
                        + processDefinition.getName() + "] with id ["
                        + processDefinition.getId() + "]");
        pe.close();
        var response = new ProcessDefinitionResponse();
        response.setId(processDefinition.getName());
        return response;
    }
}
