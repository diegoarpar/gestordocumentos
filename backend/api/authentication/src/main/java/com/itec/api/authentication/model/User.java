package com.itec.api.authentication.model;

import lombok.Data;

import java.util.List;

/**
 * The User
 */
@Data
public class User {

    /**
     * The user name.
     */
    private String name;

    /**
     * Credential
     */
    private List<Credential> credentials;

    /**
     * Roles
     */
    private List<Role> roles;
}
