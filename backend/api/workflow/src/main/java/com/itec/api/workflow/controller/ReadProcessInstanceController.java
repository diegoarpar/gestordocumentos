package com.itec.api.workflow.controller;

import com.itec.api.workflow.model.ProcessDefinitionServiceRequest;
import com.itec.api.workflow.services.ReadProcessInstanceService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import java.io.IOException;

@Controller
@RequestMapping("/workflow/process/instance")
@RequiredArgsConstructor
public class ReadProcessInstanceController {

    private final ReadProcessInstanceService baseServices;

    @GetMapping("/{instanceId}")
    public ResponseEntity<Object> getProcessNumber(HttpServletRequest req, @PathVariable String instanceId) throws IOException {
        var information = new ProcessDefinitionServiceRequest();
        information.setInstanceId(instanceId);
        var results = baseServices.execute(information);
        return ResponseEntity.ok().body(results);
    }
}

