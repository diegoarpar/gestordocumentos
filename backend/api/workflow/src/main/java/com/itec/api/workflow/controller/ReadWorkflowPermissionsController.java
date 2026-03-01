package com.itec.api.workflow.controller;

import com.itec.api.workflow.model.PermissionServiceRequest;
import com.itec.api.workflow.services.ReadWorkflowPermissionsService;
import com.itec.utilities.service.BaseService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/workflow/permissions")
public class ReadWorkflowPermissionsController {

    BaseService service;

    public ReadWorkflowPermissionsController(ReadWorkflowPermissionsService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<Object> read(HttpServletRequest req) {
        var request = new PermissionServiceRequest();
        var response = service.execute(request);
        return ResponseEntity.ok().body(response);
    }
}
