package com.data.workflow.mongo.respository;

import com.data.workflow.mongo.model.FormModel;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FormRepository extends CrudRepository<FormModel, Long> {
    FormModel findByName(String name);
}
