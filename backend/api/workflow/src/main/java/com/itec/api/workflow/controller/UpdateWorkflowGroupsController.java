package com.itec.api.workflow.controller;

import com.itec.api.workflow.model.GroupServiceRequest;
import com.itec.api.workflow.services.UpdateWorkflowGroupsService;
import com.itec.utilities.service.BaseService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/workflow/groups")
public class UpdateWorkflowGroupsController {

    BaseService service;

    public UpdateWorkflowGroupsController(UpdateWorkflowGroupsService service) {
        this.service = service;
    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> update(HttpServletRequest req, @PathVariable String id, @RequestBody GroupServiceRequest request) {
        request.setId(id);
        service.execute(request);
        return ResponseEntity.ok().build();
    }
}