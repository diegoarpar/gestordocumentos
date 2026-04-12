package com.itec.api.workflow.controller;

import com.itec.api.workflow.model.WorkflowServiceRequest;
import com.itec.api.workflow.services.CreateWorkflowService;
import com.itec.utilities.service.BaseController;
import com.itec.utilities.service.BaseService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/workflow/workflows")
public class CreateWorkflowController extends BaseController<CreateWorkflowService> {

    public CreateWorkflowController(CreateWorkflowService service) {
       super(service);
    }

    @PostMapping
    public ResponseEntity<Object> create(HttpServletRequest req, @RequestBody WorkflowServiceRequest request) {
        service.execute(request);
        return ResponseEntity.ok().build();
    }
}
