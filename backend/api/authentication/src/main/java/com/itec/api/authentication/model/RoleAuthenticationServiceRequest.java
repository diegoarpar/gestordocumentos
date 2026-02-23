package com.itec.api.authentication.model;

import com.itec.utilities.model.BaseServiceRequest;
import lombok.Data;

/**
 * Role request.
 */
@Data
public class RoleAuthenticationServiceRequest implements BaseServiceRequest {

    /**
     * The tenant.
     */
    private String tenant;

    /**
     * The user information.
     */
    private Role role;
}
