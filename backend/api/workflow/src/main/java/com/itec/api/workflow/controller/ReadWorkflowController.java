package com.itec.api.workflow.controller;

import com.itec.api.workflow.model.WorkflowServiceRequest;
import com.itec.api.workflow.services.ReadWorkflowService;
import com.itec.utilities.service.BaseService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/workflow/workflows")
public class ReadWorkflowController {

    BaseService service;

    public ReadWorkflowController(ReadWorkflowService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<Object> read(HttpServletRequest req) {
        var request = new WorkflowServiceRequest();
        var response = service.execute(request);
        return ResponseEntity.ok().body(response);
    }
}
