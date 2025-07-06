package com.itec.workflowmanager.service;

import org.activiti.engine.ProcessEngine;
import org.activiti.engine.RepositoryService;
import org.activiti.engine.repository.Deployment;
import org.activiti.engine.repository.ProcessDefinition;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.Map;

@Service
public class ProcessDefinitionService {

    Map<String, ProcessEngine> processEngineMap;
    public ProcessDefinitionService(@Qualifier("processEngine") Map<String, ProcessEngine> processEngineMap) {
        this.processEngineMap = processEngineMap;
    }

    public void deployProcess(String tenant, InputStream inputStream, String originalFilename) {
        ProcessEngine pe = processEngineMap.get(tenant);
        RepositoryService repositoryService = pe.getRepositoryService();
        Deployment deployment =  repositoryService.createDeployment()
                //.addClasspathResource(fileDetail.getFileName()).deploy();
                .addInputStream(originalFilename, inputStream)
                .deploy();

        ProcessDefinition processDefinition = repositoryService.createProcessDefinitionQuery()
                .deploymentId(deployment.getId()).singleResult();
        System.out.println(
                "Found process definition ["
                        + processDefinition.getName() + "] with id ["
                        + processDefinition.getId() + "]");
        pe.close();
    }
}
