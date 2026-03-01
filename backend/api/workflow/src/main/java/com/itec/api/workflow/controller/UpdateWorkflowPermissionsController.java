package com.itec.api.workflow.controller;

import com.itec.api.workflow.model.PermissionServiceRequest;
import com.itec.api.workflow.services.UpdateWorkflowPermissionsService;
import com.itec.utilities.service.BaseService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/workflow/permissions")
public class UpdateWorkflowPermissionsController {

    BaseService service;

    public UpdateWorkflowPermissionsController(UpdateWorkflowPermissionsService service) {
        this.service = service;
    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> update(HttpServletRequest req, @PathVariable String id, @RequestBody PermissionServiceRequest request) {
        request.setId(id);
        service.execute(request);
        return ResponseEntity.ok().build();
    }
}
