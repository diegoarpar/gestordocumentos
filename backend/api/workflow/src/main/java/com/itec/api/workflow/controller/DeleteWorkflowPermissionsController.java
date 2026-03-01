package com.itec.api.workflow.controller;

import com.itec.api.workflow.model.PermissionServiceRequest;
import com.itec.api.workflow.services.DeleteWorkflowPermissionsService;
import com.itec.utilities.service.BaseService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/workflow/permissions")
public class DeleteWorkflowPermissionsController {

    BaseService service;

    public DeleteWorkflowPermissionsController(DeleteWorkflowPermissionsService service) {
        this.service = service;
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> delete(HttpServletRequest req, @PathVariable String id) {
        var request = new PermissionServiceRequest();
        request.setId(id);
        service.execute(request);
        return ResponseEntity.ok().build();
    }
}
