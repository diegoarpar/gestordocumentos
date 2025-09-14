package com.itec.api.workflow.model;

import com.itec.utilities.model.BaseServiceRequest;
import lombok.Data;

@Data
public class TenantServiceRequest implements BaseServiceRequest {
    String tenant;
    String origin;
    String instanceId;
}
