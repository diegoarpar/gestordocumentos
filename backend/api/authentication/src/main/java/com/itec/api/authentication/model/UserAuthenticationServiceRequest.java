package com.itec.api.authentication.model;

import com.itec.utilities.model.BaseServiceRequest;
import lombok.Data;

@Data
public class UserAuthenticationServiceRequest implements BaseServiceRequest {
    String tenant;
    String instanceId;
}
