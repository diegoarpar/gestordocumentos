package com.itec.api.workflow.model;

import com.itec.utilities.model.BaseServiceRequest;
import lombok.Data;

@Data
public class UserGroupServiceRequest implements BaseServiceRequest {
    String tenant;
    String origin;
    String instanceId;
    private String id;
    private String userName;
    private String groupId;
}