package com.itec.api.workflow.model;

import com.itec.utilities.model.BaseServiceRequest;
import lombok.Data;

import java.util.UUID;

@Data
public class WorkflowServiceRequest implements BaseServiceRequest {
    String tenant;
    String origin;
    String instanceId;
    private UUID id;
    private String href;
    private String latestKeyName;
    private String name;
    private String description;
    private boolean active;
}
