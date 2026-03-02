package com.itec.api.workflow.controller;

import com.itec.api.workflow.model.ProcessDefinitionServiceRequest;
import com.itec.api.workflow.services.CreateProcessDefinitionService;
import com.itec.utilities.BasicObjectUtil;
import com.itec.utilities.service.BaseService;
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
@RequestMapping("/workflow/process/definition")
public class CreateProcessDefinitionController {

    BaseService service;
    public CreateProcessDefinitionController(CreateProcessDefinitionService processDefinitionService) {
        this.service = processDefinitionService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Object> uploadProcessDefinition(HttpServletRequest req,
                                                          @RequestParam("file") MultipartFile file

    ) throws IOException {
        String tenant = BasicObjectUtil.getTenant(req);
        var processDefinitionServiceRequest = new ProcessDefinitionServiceRequest();
        processDefinitionServiceRequest.setTenant(tenant);
        processDefinitionServiceRequest.setOriginalName(file.getOriginalFilename());
        processDefinitionServiceRequest.setInputStream(file.getInputStream());
        var response = service.execute(processDefinitionServiceRequest);
        return ResponseEntity.ok().body(response);
    }

}

