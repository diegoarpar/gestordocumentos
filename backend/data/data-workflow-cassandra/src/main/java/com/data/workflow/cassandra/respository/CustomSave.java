package com.data.workflow.cassandra.respository;

public interface CustomSave<T> {
    <S extends T> S saveWithTtl(S entity, int ttl);
}
