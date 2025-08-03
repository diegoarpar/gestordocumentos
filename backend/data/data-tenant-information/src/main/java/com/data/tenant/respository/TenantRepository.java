package com.data.tenant.respository;

import com.data.tenant.model.TenantModel;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TenantRepository extends CrudRepository<TenantModel, Long> {
    TenantModel findByName(String name);
    TenantModel findByOrigin(String origin);
}
