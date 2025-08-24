package com.data.authorization.respository;

public interface CustomSave<T> {
    <S extends T> S saveWithTtl(S entity, int ttl);
}
