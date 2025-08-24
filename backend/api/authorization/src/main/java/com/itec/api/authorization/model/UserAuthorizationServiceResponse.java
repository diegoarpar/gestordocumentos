package com.itec.api.authorization.model;

import com.itec.utilities.model.BaseServiceResponse;
import lombok.Data;

@Data
public class UserAuthorizationServiceResponse implements BaseServiceResponse {
    String content;
}
