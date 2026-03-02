package com.data.workflow.activity.service;

import com.data.workflow.activity.model.ProcessDefinitionRequest;
import com.data.workflow.activity.model.ProcessDefinitionResponse;
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

import java.io.InputStream;
import java.util.Base64;
import java.util.Map;

@Service
public class ProcessInstanceDiagramService {
    Map<String, ProcessEngine> processEngineMap;
    public ProcessInstanceDiagramService(@Qualifier("processEngine") Map<String, ProcessEngine> processEngineMap) {
        this.processEngineMap = processEngineMap;
    }

    public ProcessDefinitionResponse execute(ProcessDefinitionRequest information) {
        var response = new ProcessDefinitionResponse();
        ProcessEngine processEngine = processEngineMap.get(information.getTenant());

        RuntimeService runtimeService = processEngine.getRuntimeService();

        ProcessInstance processInstance = runtimeService.createProcessInstanceQuery()
                .processInstanceId(information.getInstanceId()).singleResult();

        RepositoryService repositoryService = processEngine.getRepositoryService();
        ProcessDefinition pde = repositoryService.getProcessDefinition(processInstance.getProcessDefinitionId());

        if (pde != null && pde.hasGraphicalNotation()) {

            InputStream diagramStream = new DefaultProcessDiagramGenerator()
                    .generateDiagram(
                            repositoryService.getBpmnModel(pde.getId()),
                            runtimeService.getActiveActivityIds(information.getInstanceId())
                    );
            try {
                var content = Base64.getEncoder().encodeToString(IOUtils.toByteArray(diagramStream));
                response.setContent(content);
            } catch (Exception e) {
                throw new ActivitiIllegalArgumentException("Error exporting diagram", e);
            }

        } else {
            throw new ActivitiIllegalArgumentException("Process instance with id '" + processInstance.getId()
                    + "' has no graphical notation defined.");
        }
        return response;
    }
}
