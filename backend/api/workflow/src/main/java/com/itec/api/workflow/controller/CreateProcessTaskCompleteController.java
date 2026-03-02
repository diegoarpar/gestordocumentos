package com.itec.api.workflow.controller;

import com.data.workflow.activity.model.ProcessInformation;
import com.itec.api.workflow.model.ProcessDefinitionServiceRequest;
import com.itec.api.workflow.services.CreateProcessTaskCompleteService;
import com.itec.utilities.BasicObjectUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.io.IOException;
import java.util.Map;

@Controller
@RequestMapping("/workflow/process/task/complete")
@RequiredArgsConstructor
public class CreateProcessTaskCompleteController {

    private final CreateProcessTaskCompleteService createProcessTaskService;

    @PostMapping("/{taskId}")
    public ResponseEntity<Object>  assign(HttpServletRequest req, @PathVariable String taskId,
                                          @RequestBody ProcessDefinitionServiceRequest processDefinitionServiceRequest) throws IOException {
        String tenant = BasicObjectUtil.getTenant(req);

        processDefinitionServiceRequest.getProcessInformation().put(ProcessInformation.TASK_ID.name(), taskId);
        createProcessTaskService.execute(processDefinitionServiceRequest);
        return ResponseEntity.ok().build();
    }
}

