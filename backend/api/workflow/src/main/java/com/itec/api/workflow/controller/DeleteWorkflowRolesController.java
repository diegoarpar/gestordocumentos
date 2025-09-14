package com.itec.api.workflow.controller;

import com.itec.api.workflow.model.TenantServiceRequest;
import com.itec.api.workflow.services.CreateWorkflowRolesService;
import com.itec.utilities.service.BaseService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/workflow/roles")
public class DeleteWorkflowRolesController {

    BaseService service;
    public DeleteWorkflowRolesController(CreateWorkflowRolesService service) {
        this.service = service;
    }

    @DeleteMapping
    public ResponseEntity<Object> create(HttpServletRequest req, @RequestBody Object body) {
        var request = new TenantServiceRequest();
        service.execute(request);
        return ResponseEntity.ok().build();
    }
}

