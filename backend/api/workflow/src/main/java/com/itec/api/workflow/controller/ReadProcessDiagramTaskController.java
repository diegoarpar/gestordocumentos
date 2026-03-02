package com.itec.api.workflow.controller;

import com.itec.api.workflow.model.ProcessDefinitionServiceRequest;
import com.itec.api.workflow.services.ReadProcessInstanceDiagramService;
import com.itec.utilities.BasicObjectUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import java.io.IOException;

@Controller
@RequestMapping("/workflow/process/instance")
@RequiredArgsConstructor
public class ReadProcessDiagramTaskController {

    private final ReadProcessInstanceDiagramService readProcessInstanceDiagramService;

    @GetMapping(value = "/diagram/{processInstanceId}")
    public ResponseEntity<Object> getProcessInstanceDiagram(HttpServletRequest req, @PathVariable String processInstanceId) throws IOException {
        String tenant= BasicObjectUtil.getTenant(req);
        var processDefinitionServiceRequest = new ProcessDefinitionServiceRequest();
        processDefinitionServiceRequest.setInstanceId(processInstanceId);
        processDefinitionServiceRequest.setTenant(tenant);
        var diagram = readProcessInstanceDiagramService.execute(processDefinitionServiceRequest);
        return ResponseEntity.ok().contentType(MediaType.IMAGE_PNG).body(diagram.getContent());
    }
}

