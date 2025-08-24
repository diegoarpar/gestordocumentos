package com.data.authorization.model;

import lombok.Data;
import org.springframework.data.cassandra.core.mapping.PrimaryKey;
import org.springframework.data.cassandra.core.mapping.Table;

@Data
@Table
public class DataAuthorizationModel {
    private @PrimaryKey Long id;
    private String jwt;
    private String userRelationId;
    private String userAuthenticatorId;
}
