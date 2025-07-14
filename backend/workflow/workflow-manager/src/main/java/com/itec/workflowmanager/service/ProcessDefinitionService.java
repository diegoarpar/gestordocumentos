package com.itec.workflowmanager.service;

import com.itec.utilities.service.BaseService;
import com.itec.workflowmanager.model.ProcessDefinitionServiceRequest;
import com.itec.workflowmanager.model.ProcessDefinitionServiceResponse;
import org.activiti.engine.ProcessEngine;
import org.activiti.engine.RepositoryService;
import org.activiti.engine.repository.Deployment;
import org.activiti.engine.repository.ProcessDefinition;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service(ProcessServiceName.DEFINITION)
public class ProcessDefinitionService implements BaseService<ProcessDefinitionServiceRequest, ProcessDefinitionServiceResponse> {

    Map<String, ProcessEngine> processEngineMap;
    public ProcessDefinitionService(@Qualifier("processEngine") Map<String, ProcessEngine> processEngineMap) {
        this.processEngineMap = processEngineMap;
    }

    @Override
    public ProcessDefinitionServiceResponse execute(ProcessDefinitionServiceRequest information) {
        ProcessEngine pe = processEngineMap.get(information.getTenant());
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
        return null;
    }
}
