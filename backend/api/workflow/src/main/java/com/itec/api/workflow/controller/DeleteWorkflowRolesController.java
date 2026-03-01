package com.itec.api.workflow.controller;

import com.itec.api.workflow.model.RoleServiceRequest;
import com.itec.api.workflow.services.DeleteWorkflowRolesService;
import com.itec.utilities.service.BaseService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/workflow/roles")
public class DeleteWorkflowRolesController {

    BaseService service;
    public DeleteWorkflowRolesController(DeleteWorkflowRolesService service) {
        this.service = service;
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> create(HttpServletRequest req, @PathVariable String id) {
        var request = new RoleServiceRequest();
        request.setId(id);
        service.execute(request);
        return ResponseEntity.ok().build();
    }
}

