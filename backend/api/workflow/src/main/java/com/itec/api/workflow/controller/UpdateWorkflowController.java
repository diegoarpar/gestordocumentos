package com.itec.api.workflow.controller;

import com.itec.api.workflow.model.WorkflowServiceRequest;
import com.itec.api.workflow.services.UpdateWorkflowService;
import com.itec.utilities.service.BaseService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/workflow/workflows")
public class UpdateWorkflowController {

    BaseService service;

    public UpdateWorkflowController(UpdateWorkflowService service) {
        this.service = service;
    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> update(HttpServletRequest req, @PathVariable String id, @RequestBody WorkflowServiceRequest request) {
        request.setId(id);
        service.execute(request);
        return ResponseEntity.ok().build();
    }
}
