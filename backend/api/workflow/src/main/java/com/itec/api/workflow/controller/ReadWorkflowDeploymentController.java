package com.itec.api.workflow.controller;

import com.itec.api.workflow.model.WorkflowDeploymentServiceRequest;
import com.itec.api.workflow.services.ReadWorkflowDeploymentService;
import com.itec.utilities.service.BaseService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequestMapping("/workflow/workflow-deployments")
public class ReadWorkflowDeploymentController {

    BaseService service;

    public ReadWorkflowDeploymentController(ReadWorkflowDeploymentService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<Object> read(HttpServletRequest req, @RequestParam(required = false) String workflowId) {
        var request = new WorkflowDeploymentServiceRequest();
        request.setWorkflowId(workflowId);
        var response = service.execute(request);
        return ResponseEntity.ok().body(response);
    }
}
