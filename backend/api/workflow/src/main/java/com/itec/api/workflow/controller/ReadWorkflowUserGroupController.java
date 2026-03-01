package com.itec.api.workflow.controller;

import com.itec.api.workflow.model.UserGroupServiceRequest;
import com.itec.api.workflow.services.ReadWorkflowUserGroupService;
import com.itec.utilities.service.BaseService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/workflow/user-groups")
public class ReadWorkflowUserGroupController {

    BaseService service;

    public ReadWorkflowUserGroupController(ReadWorkflowUserGroupService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<Object> read(HttpServletRequest req) {
        var request = new UserGroupServiceRequest();
        var response = service.execute(request);
        return ResponseEntity.ok().body(response);
    }
}