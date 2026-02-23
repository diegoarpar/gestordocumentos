package com.itec.api.authentication.model;

import com.itec.utilities.model.BaseServiceResponse;
import lombok.Data;

/**
 * The user response
 *
 * @author diegoarpar
 */
@Data
public class RoleAuthenticationServiceResponse implements BaseServiceResponse {

    /**
     * The content.
     */
    private String content;

    /**
     * The jwt.
     */
    private String jwt;

    /**
     * The role.
     */
    private Role role;
}
