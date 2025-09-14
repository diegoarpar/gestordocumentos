package com.itec.api.workflow.controller;

import com.itec.api.workflow.model.TenantServiceRequest;
import com.itec.api.workflow.services.ReadWorkflowRolesService;
import com.itec.utilities.service.BaseService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/workflow/roles")
public class CreateWorkflowRolesController {

    BaseService service;
    public CreateWorkflowRolesController(ReadWorkflowRolesService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Object> crate(HttpServletRequest req) {
        var request = new TenantServiceRequest();
        service.execute(request);
        return ResponseEntity.ok().build();
    }

}

