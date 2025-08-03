package com.itec.api.tenant.model;

import com.itec.utilities.model.BaseServiceResponse;
import lombok.Data;

@Data
public class TenantServiceResponse implements BaseServiceResponse {
    String content;
    String name;
    String origin;
    String phrase;
}
