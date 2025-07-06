package com.itec.workflowmanager.controller;

import com.itec.utilities.BasicObjectUtil;
import com.itec.workflowmanager.service.ProcessInstanceService;
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

    ProcessInstanceService service;
    public ProcessInstanceController(ProcessInstanceService processInstanceService) {
        service = processInstanceService;
    }

    @PostMapping(value = "/initProcessInstance")
    public ResponseEntity<Object> initProcessInstance(HttpServletRequest req, Map<String, String> processInformation,
                                               Map<String, String> instanceInformation) throws IOException {
        String tenant = BasicObjectUtil.getTenant(req);
        service.initProcessInstance(tenant, processInformation, instanceInformation);
        return ResponseEntity.ok().build();
    }


    @GetMapping(value = "/diagram/{processInstanceId}")
    public ResponseEntity<Object> getProcessInstanceDiagram(HttpServletRequest req, @PathVariable String processInstanceId) throws IOException {
        String tenant= BasicObjectUtil.getTenant(req);
        String image = service.getProcessInstanceDiagram(tenant, processInstanceId);
        return ResponseEntity.ok().contentType(MediaType.IMAGE_PNG).body(image);
    }


    @PostMapping (value = "/getHistory")
    public void getHistory(HttpServletRequest req) throws IOException {
    }

}

