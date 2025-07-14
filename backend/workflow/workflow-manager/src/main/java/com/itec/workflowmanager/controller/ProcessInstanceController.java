package com.itec.workflowmanager.controller;

import com.itec.utilities.BasicObjectUtil;
import com.itec.utilities.model.BaseServiceRequest;
import com.itec.utilities.service.BaseService;
import com.itec.workflowmanager.model.ProcessDefinitionServiceRequest;
import com.itec.workflowmanager.service.ProcessInitInstanceService;
import com.itec.workflowmanager.service.ProcessInstanceDiagramService;
import com.itec.workflowmanager.service.ProcessServiceName;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.io.IOException;
import java.util.Map;

@Controller
@RequestMapping("/workflowmanager/processInstance/")
public class ProcessInstanceController {

    private final Map<String, BaseService> baseServices;
    public ProcessInstanceController(Map<String, BaseService> baseServices) {
        this.baseServices = baseServices;
    }

    @PostMapping(value = "/initProcessInstance")
    public ResponseEntity<Object> initProcessInstance(HttpServletRequest req, Map<String, String> processInformation,
                                               Map<String, String> instanceInformation) throws IOException {
        String tenant = BasicObjectUtil.getTenant(req);
        var processDefinitionServiceRequest = new ProcessDefinitionServiceRequest();
        processDefinitionServiceRequest.setTenant(tenant);
        processDefinitionServiceRequest.setProcessInformation(processInformation);
        processDefinitionServiceRequest.setInstanceInformation(instanceInformation);
        baseServices.get(ProcessServiceName.INIT_INSTANCE).execute(processDefinitionServiceRequest);
        return ResponseEntity.ok().build();
    }


    @GetMapping(value = "/diagram/{processInstanceId}")
    public ResponseEntity<Object> getProcessInstanceDiagram(HttpServletRequest req, @PathVariable String processInstanceId) throws IOException {
        String tenant= BasicObjectUtil.getTenant(req);
        var processDefinitionServiceRequest = new ProcessDefinitionServiceRequest();
        processDefinitionServiceRequest.setInstanceId(processInstanceId);
        processDefinitionServiceRequest.setTenant(tenant);
        var diagram = (ProcessInstanceDiagramService) baseServices.get(ProcessServiceName.DIAGRAM);
        return ResponseEntity.ok().contentType(MediaType.IMAGE_PNG).body(diagram.execute(processDefinitionServiceRequest).getContent());
    }


    @PostMapping (value = "/getHistory")
    public void getHistory(HttpServletRequest req) throws IOException {
    }

}

