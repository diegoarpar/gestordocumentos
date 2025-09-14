package com.itec.api.workflow.services;

import com.itec.api.workflow.model.TenantServiceRequest;
import com.itec.api.workflow.model.TenantServiceResponse;
import com.itec.utilities.service.BaseService;
import org.springframework.stereotype.Service;

@Service
public class ReadWorkflowRolesService implements BaseService<TenantServiceRequest, TenantServiceResponse> {

    @Override
    public TenantServiceResponse execute(TenantServiceRequest information) {
        return null;
    }
}
