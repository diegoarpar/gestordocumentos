package com.itec.api.authentication.model;

import com.itec.utilities.model.BaseServiceResponse;
import lombok.Data;

@Data
public class UserAuthenticationServiceResponse implements BaseServiceResponse {
    String content;
    String jwt;
}
