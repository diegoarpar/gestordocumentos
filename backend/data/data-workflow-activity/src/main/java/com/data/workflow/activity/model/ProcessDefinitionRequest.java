package com.data.workflow.activity.model;

import lombok.Data;

import java.io.InputStream;
import java.util.Map;

@Data
public class ProcessDefinitionRequest {
    String tenant;
    String instanceId;
    InputStream inputStream;
    String originalName;
    String workflowName;
    Map<String, Object> processInformation;
}
