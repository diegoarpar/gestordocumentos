package com.itec.api.authorization.model;

import com.itec.utilities.model.BaseServiceResponse;
import lombok.Data;

/**
 * User request.
 */
@Data
public class TokenServiceResponse implements BaseServiceResponse {

    /**
     * The tenant.
     */
    private String tenant;
    private String userAuthorization;
    private String appAuthorization;

}
