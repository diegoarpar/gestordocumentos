package com.itec.api.workflow.controller;

import com.itec.api.workflow.model.ActivityServiceRequest;
import com.itec.api.workflow.services.CreateActivityService;
import com.itec.utilities.service.BaseService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/workflow/activities")
public class CreateActivityController {

    BaseService service;

    public CreateActivityController(CreateActivityService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Object> create(HttpServletRequest req, @RequestBody ActivityServiceRequest request) {
        service.execute(request);
        return ResponseEntity.ok().build();
    }
}
