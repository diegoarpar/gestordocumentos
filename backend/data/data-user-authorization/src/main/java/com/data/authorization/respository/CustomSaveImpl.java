package com.data.authorization.respository;

import org.springframework.data.cassandra.core.CassandraOperations;
import org.springframework.data.cassandra.core.InsertOptions;

public class CustomSaveImpl<T> implements CustomSave<T> {

    private CassandraOperations operations;
    public CustomSaveImpl(CassandraOperations cassandraOperations) {
        this.operations = cassandraOperations;
    }

    @Override
    public <S extends T> S saveWithTtl(S entity, int ttl) {
        InsertOptions insertOptions = InsertOptions.builder().ttl(ttl).build();
        operations.insert(entity, insertOptions);
        return entity;
    }
}
