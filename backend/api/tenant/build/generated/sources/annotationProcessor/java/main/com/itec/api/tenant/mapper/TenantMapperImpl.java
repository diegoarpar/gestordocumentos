package com.itec.api.tenant.mapper;

import com.data.tenant.model.TenantModel;
import com.itec.api.tenant.model.TenantServiceRequest;
import com.itec.api.tenant.model.TenantServiceResponse;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-02-23T23:58:10-0500",
    comments = "version: 1.6.0.Beta1, compiler: IncrementalProcessingEnvironment from gradle-language-java-8.13.jar, environment: Java 21.0.4 (Amazon.com Inc.)"
)
@Component
public class TenantMapperImpl implements TenantMapper {

    @Override
    public TenantServiceResponse tenantDto(TenantModel model) {
        if ( model == null ) {
            return null;
        }

        TenantServiceResponse tenantServiceResponse = new TenantServiceResponse();

        tenantServiceResponse.setName( model.getName() );
        tenantServiceResponse.setPhrase( model.getPhrase() );
        tenantServiceResponse.setOrigin( model.getOrigin() );

        return tenantServiceResponse;
    }

    @Override
    public TenantModel tenantModel(TenantServiceRequest request) {
        if ( request == null ) {
            return null;
        }

        TenantModel.TenantModelBuilder tenantModel = TenantModel.builder();

        tenantModel.origin( request.getOrigin() );

        return tenantModel.build();
    }
}
