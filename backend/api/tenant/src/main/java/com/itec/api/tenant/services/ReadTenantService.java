package com.itec.api.tenant.services;

import com.data.tenant.service.TenantServiceRepository;
import com.itec.api.tenant.mapper.TenantMapper;
import com.itec.api.tenant.model.TenantServiceRequest;
import com.itec.api.tenant.model.TenantServiceResponse;
import com.itec.utilities.service.BaseService;
import org.springframework.stereotype.Service;

@Service
public class ReadTenantService implements BaseService<TenantServiceRequest, TenantServiceResponse> {

    TenantServiceRepository tenantServiceRepository;
    TenantMapper tenantMapper;

    public ReadTenantService(TenantServiceRepository tenantServiceRepository, TenantMapper tenantMapper) {
        this.tenantServiceRepository = tenantServiceRepository;
        this.tenantMapper = tenantMapper;
    }

    @Override
    public TenantServiceResponse execute(TenantServiceRequest information) {
        var model = tenantMapper.tenantModel(information);
        return tenantMapper.tenantDto(tenantServiceRepository.readByOrigin(model));
    }
}
