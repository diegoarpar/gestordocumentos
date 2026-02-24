package com.itec.api.workflow.controller;

import com.itec.api.workflow.model.RoleServiceRequest;
import com.itec.api.workflow.services.CreateWorkflowRolesService;
import com.itec.utilities.service.BaseService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/workflow/roles")
public class CreateWorkflowRolesController {

    BaseService service;
    public CreateWorkflowRolesController(CreateWorkflowRolesService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Object> crate(HttpServletRequest req, @RequestBody RoleServiceRequest roleServiceRequest) {
        service.execute(roleServiceRequest);
        return ResponseEntity.ok().build();
    }

}

