package com.itec.api.workflow.model;

import com.itec.utilities.model.BaseServiceRequest;
import lombok.Data;

@Data
public class WorkflowServiceRequest implements BaseServiceRequest {
    String tenant;
    String origin;
    String instanceId;
    private String id;
    private String href;
    private String name;
    private String description;
    private boolean active;
}
