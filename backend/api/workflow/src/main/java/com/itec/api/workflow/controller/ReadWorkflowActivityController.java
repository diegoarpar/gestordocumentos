package com.itec.api.workflow.controller;

import com.itec.api.workflow.model.WorkflowActivityServiceRequest;
import com.itec.api.workflow.services.ReadWorkflowActivityService;
import com.itec.utilities.service.BaseService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequestMapping("/workflow/workflow-activities")
public class ReadWorkflowActivityController {

    BaseService service;

    public ReadWorkflowActivityController(ReadWorkflowActivityService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<Object> read(HttpServletRequest req, @RequestParam(required = false) String workflowId) {
        var request = new WorkflowActivityServiceRequest();
        request.setWorkflowId(workflowId);
        var response = service.execute(request);
        return ResponseEntity.ok().body(response);
    }
}
