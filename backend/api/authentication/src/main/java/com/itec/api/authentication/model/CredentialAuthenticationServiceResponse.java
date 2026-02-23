package com.itec.api.authentication.model;

import com.itec.utilities.model.BaseServiceResponse;
import lombok.Data;

/**
 * The credential response
 *
 * @author diegoarpar
 */
@Data
public class CredentialAuthenticationServiceResponse implements BaseServiceResponse {

    /**
     * The content.
     */
    private String content;

    /**
     * The jwt.
     */
    private String jwt;

    /**
     * The credential.
     */
    private Credential credential;
}
