package com.itec.api.authentication.model;

import com.itec.utilities.model.BaseServiceRequest;
import lombok.Data;

@Data
public class UserServiceRequest implements BaseServiceRequest {

    @Override
    public String getTenant() {
        return "";
    }

    @Override
    public void setTenant(String tenant) {

    }
}
