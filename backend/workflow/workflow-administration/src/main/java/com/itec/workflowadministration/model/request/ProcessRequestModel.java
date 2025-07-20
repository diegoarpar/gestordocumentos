package com.itec.workflowadministration.model.request;

import com.itec.utilities.model.BaseServiceRequest;
import lombok.Data;

@Data
public class ProcessRequestModel implements BaseServiceRequest {

    @Override
    public String getTenant() {
        return "";
    }

    @Override
    public void setTenant(String tenant) {

    }
    private String name;
}
