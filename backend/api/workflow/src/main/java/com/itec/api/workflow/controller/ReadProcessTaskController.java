package com.itec.api.workflow.controller;

import com.data.workflow.activity.model.ProcessInformation;
import com.itec.api.workflow.model.ProcessDefinitionServiceRequest;
import com.itec.api.workflow.services.ReadProcessTaskService;
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
@RequestMapping("/workflow/process/task/information")
@RequiredArgsConstructor
public class ReadProcessTaskController {

    private final ReadProcessTaskService readProcessTaskService;

    @GetMapping("/{taskId}")
    public ResponseEntity<Object> readInformation(HttpServletRequest req, @PathVariable String taskId) throws IOException {
        String tenant = BasicObjectUtil.getTenant(req);
        var processDefinitionRequest = new ProcessDefinitionServiceRequest();
        Map<String, Object> processInformation = Map.of(ProcessInformation.TASK_ID.name(), taskId);
        processDefinitionRequest.setProcessInformation(processInformation);
        var results = readProcessTaskService.execute(processDefinitionRequest);
        return ResponseEntity.ok().body(results);
    }
}

