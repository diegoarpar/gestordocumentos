package com.itec.api.workflow.model;

import com.itec.utilities.model.BaseServiceRequest;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@Data
public class WorkflowDeploymentServiceRequest implements BaseServiceRequest {
    String tenant;
    String origin;
    String instanceId;
    private String id;
    private String workflowId;
    private String fileName;
    private String filePath;
    private String deployedBy;
    private String status;
    private MultipartFile file;
    private Map<String, Object> processInformation;
}
