package com.itec.api.workflow.controller;

import com.itec.api.workflow.model.WorkflowServiceRequest;
import com.itec.api.workflow.services.DeleteWorkflowService;
import com.itec.utilities.service.BaseService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/workflow/workflows")
public class DeleteWorkflowController {

    BaseService service;

    public DeleteWorkflowController(DeleteWorkflowService service) {
        this.service = service;
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> delete(HttpServletRequest req, @PathVariable String id) {
        var request = new WorkflowServiceRequest();
        request.setId(id);
        service.execute(request);
        return ResponseEntity.ok().build();
    }
}
