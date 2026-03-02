package com.itec.api.workflow.controller;

import com.data.workflow.activity.model.ProcessInformation;
import com.itec.api.workflow.model.ProcessDefinitionServiceRequest;
import com.itec.api.workflow.services.ReadProcessTaskService;
import com.itec.api.workflow.services.ReadProcessUserTaskService;
import com.itec.utilities.BasicObjectUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import java.io.IOException;
import java.util.Map;

@Controller
@RequestMapping("/workflow/process/task/user")
@RequiredArgsConstructor
public class ReadProcessUserTaskController {

    private final ReadProcessUserTaskService readProcessTaskService;

    @GetMapping("/{userId}")
    public ResponseEntity<Object> readInformation(HttpServletRequest req, @PathVariable String userId) throws IOException {
        String tenant = BasicObjectUtil.getTenant(req);
        Map<String, Object> processInformation = Map.of(ProcessInformation.USER_NAME.name(), userId);
        var processDefinitionRequest = new ProcessDefinitionServiceRequest();
        processDefinitionRequest.setProcessInformation(processInformation);
        var results = readProcessTaskService.execute(processDefinitionRequest);
        return ResponseEntity.ok().body(results);
    }
}

