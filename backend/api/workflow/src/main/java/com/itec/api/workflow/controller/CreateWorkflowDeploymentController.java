package com.itec.api.workflow.controller;

import com.itec.api.workflow.model.WorkflowDeploymentServiceRequest;
import com.itec.api.workflow.services.CreateWorkflowDeploymentService;
import com.itec.utilities.service.BaseController;
import com.itec.utilities.service.BaseService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.support.StandardMultipartHttpServletRequest;

@Controller
@RequestMapping("/workflow/workflow-deployments")
public class CreateWorkflowDeploymentController extends BaseController<CreateWorkflowDeploymentService> {

    public CreateWorkflowDeploymentController(CreateWorkflowDeploymentService service) {
       super(service);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Object> create(StandardMultipartHttpServletRequest req,
                                         @RequestParam("deployedBy") String deployedBy,
                                         @RequestParam("fileName") String fileName,
                                         @RequestParam("filePath") String filePath,
                                         @RequestParam("status") String status,
                                         @RequestParam("workflowId") String workflowId,
                                         @RequestParam("file") MultipartFile file) {
        var request = new WorkflowDeploymentServiceRequest();
        request.setFile(file);
        request.setDeployedBy(deployedBy);
        request.setFileName(fileName);
        request.setFilePath(filePath);
        request.setStatus(status);
        request.setWorkflowId(workflowId);
        service.execute(request);
        return ResponseEntity.ok().build();
    }
}
