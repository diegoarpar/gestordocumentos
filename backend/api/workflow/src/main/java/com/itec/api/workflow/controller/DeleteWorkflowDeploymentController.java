package com.itec.api.workflow.controller;

import com.itec.api.workflow.model.WorkflowDeploymentServiceRequest;
import com.itec.api.workflow.services.DeleteWorkflowDeploymentService;
import com.itec.utilities.service.BaseService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/workflow/workflow-deployments")
public class DeleteWorkflowDeploymentController {

    BaseService service;

    public DeleteWorkflowDeploymentController(DeleteWorkflowDeploymentService service) {
        this.service = service;
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> delete(HttpServletRequest req, @PathVariable String id) {
        var request = new WorkflowDeploymentServiceRequest();
        request.setId(id);
        service.execute(request);
        return ResponseEntity.ok().build();
    }
}
