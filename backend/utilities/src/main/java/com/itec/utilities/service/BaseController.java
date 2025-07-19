package com.itec.utilities.service;

import com.itec.utilities.model.BaseServiceRequest;
import com.itec.utilities.model.BaseServiceResponse;

public interface BaseService <B extends BaseServiceRequest, R extends BaseServiceResponse>{
    R execute(B information);
}
