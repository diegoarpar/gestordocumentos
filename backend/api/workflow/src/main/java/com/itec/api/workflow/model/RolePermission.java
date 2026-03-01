package com.itec.api.workflow.model;

import lombok.Data;

import java.util.UUID;

@Data
public class RolePermission {
    private UUID id;
    private UUID roleId;
    private UUID permissionId;
}
