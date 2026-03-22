package com.itec.api.workflow.model;

import com.itec.utilities.model.BaseServiceRequest;
import lombok.Data;

@Data
public class ActivityServiceRequest implements BaseServiceRequest {
    String tenant;
    String origin;
    String instanceId;
    private String id;
    private String name;
    private String type;
    private String href;
    private String description;
    private boolean active;
}
