package com.itec.api.workflow.model;

import com.itec.utilities.model.BaseServiceRequest;
import lombok.Data;

import java.io.InputStream;
import java.util.Map;

@Data
public class ProcessDefinitionServiceRequest implements BaseServiceRequest {
    private String tenant;
    private String instanceId;
    private InputStream inputStream;
    private String originalName;
    private String workflowName;
    private Map<String, Object> processInformation;
}
