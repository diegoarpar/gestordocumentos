package com.itec.api.workflow.controller;

import com.itec.api.workflow.model.RolePermissionServiceRequest;
import com.itec.api.workflow.services.ReadWorkflowRolePermissionService;
import com.itec.utilities.service.BaseService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/workflow/role-permissions")
public class ReadWorkflowRolePermissionController {

    BaseService service;

    public ReadWorkflowRolePermissionController(ReadWorkflowRolePermissionService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<Object> read(HttpServletRequest req) {
        var request = new RolePermissionServiceRequest();
        var response = service.execute(request);
        return ResponseEntity.ok().body(response);
    }
}
