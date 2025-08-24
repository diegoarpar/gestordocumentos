package com.data.authorization.respository;

import com.data.authorization.model.DataAuthorizationModel;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DataAuthorizationRepository extends CrudRepository<DataAuthorizationModel, Long> {
}
