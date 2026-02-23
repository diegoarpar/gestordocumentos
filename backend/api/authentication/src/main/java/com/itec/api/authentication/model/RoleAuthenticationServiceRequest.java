package com.itec.api.authentication.model;

import com.itec.utilities.model.BaseServiceRequest;
import lombok.Data;

/**
 * User request.
 */
@Data
public class UserAuthenticationServiceRequest implements BaseServiceRequest {

    /**
     * The tenant.
     */
    private String tenant;

    /**
     * The email.
     */
    private String email;

    /**
     * The user information.
     */
    private User user;
}
