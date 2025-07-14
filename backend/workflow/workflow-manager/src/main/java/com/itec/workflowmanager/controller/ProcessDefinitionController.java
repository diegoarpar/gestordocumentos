package com.itec.workflowmanager.controller;

import com.itec.utilities.BasicObjectUtil;
import com.itec.utilities.service.BaseService;
import com.itec.workflowmanager.model.ProcessDefinitionServiceRequest;
import com.itec.workflowmanager.service.ProcessDefinitionService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Controller
@RequestMapping("/workflowmanager/processDefinition/")
public class ProcessDefinitionController {

    BaseService service;
    public ProcessDefinitionController(ProcessDefinitionService processDefinitionService) {
        this.service = processDefinitionService;
    }

    @PostMapping(value = "/uploadProcessDefinition",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Object> uploadProcessDefinition(HttpServletRequest req,
                                                          @RequestParam("file") MultipartFile file,
                                                          @RequestParam("fileName") String fileName

    ) throws IOException {
        String tenant = BasicObjectUtil.getTenant(req);
        var processDefinitionServiceRequest = new ProcessDefinitionServiceRequest();
        processDefinitionServiceRequest.setTenant(tenant);
        processDefinitionServiceRequest.setOriginalName(file.getOriginalFilename());
        processDefinitionServiceRequest.setInputStream(file.getInputStream());
        service.execute(processDefinitionServiceRequest);
        return ResponseEntity.ok().build();
    }

}

