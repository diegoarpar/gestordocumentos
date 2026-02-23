package com.itec.api.authentication.model;

import com.itec.utilities.model.BaseServiceRequest;
import lombok.Data;

/**
 * User request.
 */
@Data
public class CredentialAuthenticationServiceRequest implements BaseServiceRequest {

    /**
     * The tenant.
     */
    private String tenant;

    /**
     * The credential information.
     */
    private Credential credential;
}
