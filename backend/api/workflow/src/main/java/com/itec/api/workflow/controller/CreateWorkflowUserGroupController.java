package com.itec.api.workflow.controller;

import com.itec.api.workflow.model.UserGroupServiceRequest;
import com.itec.api.workflow.services.CreateWorkflowUserGroupService;
import com.itec.utilities.service.BaseService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/workflow/user-groups")
public class CreateWorkflowUserGroupController {

    BaseService service;

    public CreateWorkflowUserGroupController(CreateWorkflowUserGroupService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Object> create(HttpServletRequest req, @RequestBody UserGroupServiceRequest request) {
        service.execute(request);
        return ResponseEntity.ok().build();
    }
}