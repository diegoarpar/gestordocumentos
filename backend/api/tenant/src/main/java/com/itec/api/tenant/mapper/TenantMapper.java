package com.itec.api.tenant.mapper;

import com.data.tenant.model.TenantModel;
import com.itec.api.tenant.model.TenantServiceRequest;
import com.itec.api.tenant.model.TenantServiceResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TenantMapper {
    @Mapping(target = "name", source = "model.name")
    @Mapping(target = "phrase", source = "model.phrase")
    TenantServiceResponse tenantDto(TenantModel model);

    @Mapping(target = "origin", source = "request.origin")
    TenantModel tenantModel(TenantServiceRequest request);
}

