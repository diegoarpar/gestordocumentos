package com.itec.api.authentication.model;

import lombok.Data;

/**
 * Roles
 *
 * @author diegoarpar
 */
@Data
public class Role {

    /**
     * The role ID.
     */
    private Long id;

    /**
     * The role name.
     */
    private String name;
}
