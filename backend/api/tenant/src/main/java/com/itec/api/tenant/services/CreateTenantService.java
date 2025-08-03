package com.itec.api.tenant.services;

import com.itec.api.tenant.model.TenantServiceRequest;
import com.itec.api.tenant.model.TenantServiceResponse;
import com.itec.utilities.service.BaseService;
import org.springframework.stereotype.Service;

@Service
public class CreateTenantService implements BaseService<TenantServiceRequest, TenantServiceResponse> {

    @Override
    public TenantServiceResponse execute(TenantServiceRequest information) {
        return null;
    }
}
