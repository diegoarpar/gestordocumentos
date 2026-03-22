package com.itec.api.workflow.controller;

import com.itec.api.workflow.model.WorkflowActivityServiceRequest;
import com.itec.api.workflow.services.CreateWorkflowActivityService;
import com.itec.utilities.service.BaseService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/workflow/workflow-activities")
public class CreateWorkflowActivityController {

    BaseService service;

    public CreateWorkflowActivityController(CreateWorkflowActivityService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Object> create(HttpServletRequest req, @RequestBody WorkflowActivityServiceRequest request) {
        service.execute(request);
        return ResponseEntity.ok().build();
    }
}
