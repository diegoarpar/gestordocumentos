package com.itec.api.workflow.controller;

import com.itec.api.workflow.model.ProcessDefinitionServiceRequest;
import com.data.workflow.activity.model.ProcessInformation;
import com.itec.api.workflow.services.CreateProcessTaskService;
import com.itec.utilities.BasicObjectUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.io.IOException;
import java.util.Map;

@Controller
@RequestMapping("/workflow/process/task/assign")
@RequiredArgsConstructor
public class CreateProcessTaskAssignController {

    private final CreateProcessTaskService createProcessTaskService;

    @PostMapping("/{taskId}/{userId}")
    public ResponseEntity<Object> assign(HttpServletRequest req, @PathVariable String taskId,
                                      @PathVariable String userId) {
        String tenant = BasicObjectUtil.getTenant(req);
        var request = new ProcessDefinitionServiceRequest();
        Map<String, Object> processInformation = Map.of(ProcessInformation.USER_NAME.name(), userId, ProcessInformation.TASK_ID.name(), taskId);
        request.setProcessInformation(processInformation);
        createProcessTaskService.execute(request);
        return ResponseEntity.ok().build();
    }

}

