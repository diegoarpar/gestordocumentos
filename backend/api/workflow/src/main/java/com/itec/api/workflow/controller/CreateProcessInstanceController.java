package com.itec.api.workflow.controller;

import com.itec.api.workflow.model.ProcessDefinitionServiceRequest;
import com.itec.api.workflow.services.CreateProcessInstanceService;
import com.itec.utilities.BasicObjectUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.io.IOException;
import java.util.Map;

@Controller
@RequestMapping("/workflow/process/instance")
@RequiredArgsConstructor
public class CreateProcessInstanceController {

    private final CreateProcessInstanceService baseServices;

    @PostMapping
    public ResponseEntity<Object> initProcessInstance(HttpServletRequest req,
                                                      @RequestBody ProcessDefinitionServiceRequest request) {
        String tenant = BasicObjectUtil.getTenant(req);
        request.setTenant(tenant);
        var result = baseServices.execute(request);
        return ResponseEntity.ok().body(result);
    }
}

