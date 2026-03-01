package com.itec.api.workflow.controller;

import com.itec.api.workflow.model.GroupServiceRequest;
import com.itec.api.workflow.services.CreateWorkflowGroupsService;
import com.itec.utilities.service.BaseService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/workflow/groups")
public class CreateWorkflowGroupsController {

    BaseService service;

    public CreateWorkflowGroupsController(CreateWorkflowGroupsService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Object> create(HttpServletRequest req, @RequestBody GroupServiceRequest request) {
        service.execute(request);
        return ResponseEntity.ok().build();
    }
}
