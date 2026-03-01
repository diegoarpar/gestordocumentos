package com.itec.api.workflow.controller;

import com.itec.api.workflow.model.RolePermissionServiceRequest;
import com.itec.api.workflow.services.CreateWorkflowRolePermissionService;
import com.itec.utilities.service.BaseService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/workflow/role-permissions")
public class CreateWorkflowRolePermissionController {

    BaseService service;

    public CreateWorkflowRolePermissionController(CreateWorkflowRolePermissionService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Object> create(HttpServletRequest req, @RequestBody RolePermissionServiceRequest request) {
        service.execute(request);
        return ResponseEntity.ok().build();
    }
}
