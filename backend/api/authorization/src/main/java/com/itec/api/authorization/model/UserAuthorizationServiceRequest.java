package com.itec.api.authorization.model;

import com.itec.utilities.model.BaseServiceRequest;
import lombok.Data;

@Data
public class UserAuthorizationServiceRequest implements BaseServiceRequest {
    String tenant;
    String instanceId;
}
