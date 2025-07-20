package com.itec.utilities.service;

import com.itec.utilities.model.BaseServiceRequest;
import com.itec.utilities.model.BaseServiceResponse;

public interface BaseController <S extends BaseService, B extends BaseServiceRequest, R extends BaseServiceResponse>{
    R execute(B information);
}
