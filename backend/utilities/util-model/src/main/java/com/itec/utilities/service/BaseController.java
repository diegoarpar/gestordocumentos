package com.itec.utilities.service;

public abstract class BaseController <S extends BaseService<?, ?>>{
    public final S service;

    protected BaseController(S service) {
        this.service = service;
    }
}
