package com.itec.workflowmanager.model;

import com.itec.utilities.model.BaseServiceRequest;
import lombok.Data;

import java.io.InputStream;
import java.util.Map;

@Data
public class ProcessDefinitionServiceRequest implements BaseServiceRequest {
    String tenant;
    String instanceId;
    InputStream inputStream;
    String originalName;
    Map<String, String> processInformation;
    Map<String, String> instanceInformation;
}
