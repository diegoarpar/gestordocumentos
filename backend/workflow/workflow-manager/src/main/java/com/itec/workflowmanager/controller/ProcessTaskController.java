package com.itec.workflowmanager.controller;

import com.itec.utilities.BasicObjectUtil;
import com.itec.workflowmanager.service.ProcessTaskService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.io.IOException;
import java.util.*;

@Controller
@RequestMapping("/workflowmanager/processTask/")
public class ProcessTaskController {

    ProcessTaskService service;
    public ProcessTaskController (ProcessTaskService processTaskService) {
        this.service = processTaskService;
    }


    @PostMapping("/getTask")
    public List<Map<String, String>> getTask(HttpServletRequest req) throws IOException {
        String tenant = BasicObjectUtil.getTenant(req);
        String user = BasicObjectUtil.getTenant(req);
        return service.getTask(tenant, user, new ArrayList<>());
    }

    @PostMapping(value = "/completeTask/{taskId}")
    public ResponseEntity<Object> completeTask(HttpServletRequest req, @PathVariable String taskId, Map<String, Object> processInformation) {
        String tenant = BasicObjectUtil.getTenant(req);
        String user = BasicObjectUtil.getTenant(req);
        service.completeTask(tenant, taskId, user, processInformation);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/assign/{taskId}/{userId}")
    public ResponseEntity<Object>  assign(HttpServletRequest req, @PathVariable String taskId,
                                      @PathVariable String userId) throws IOException {
        String tenant = BasicObjectUtil.getTenant(req);
        service.assign(tenant, taskId, userId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/getHistory")
    public void getHistory(HttpServletRequest req) throws IOException {
    }

    @PostMapping("/getTaskInformation")
    public void getTaskInformation(HttpServletRequest req) throws IOException {
    }
}

