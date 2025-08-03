package com.itec.api.tenant.model;

import com.itec.utilities.model.BaseServiceRequest;
import lombok.Data;

@Data
public class TenantServiceRequest implements BaseServiceRequest {
    String tenant;
    String origin;
    String instanceId;
}
