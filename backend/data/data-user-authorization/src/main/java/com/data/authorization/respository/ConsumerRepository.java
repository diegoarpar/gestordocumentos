package com.data.authorization.respository;

import com.data.authorization.model.ConsumerEntity;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConsumerRepository extends CrudRepository<ConsumerEntity, Long> {

    List<ConsumerEntity> findByConsumerId(String consumerId);
}
