package com.itec.api.authentication.model;

import com.itec.utilities.model.BaseServiceResponse;
import lombok.Data;

/**
 * The user response
 *
 * @author diegoarpar
 */
@Data
public class UserAuthenticationServiceResponse implements BaseServiceResponse {

    /**
     * The content.
     */
    private String content;

    /**
     * The jwt.
     */
    private String jwt;

    /**
     * The user
     */
    private User user;
}
