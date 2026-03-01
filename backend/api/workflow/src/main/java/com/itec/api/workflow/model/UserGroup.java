package com.itec.api.workflow.model;

import lombok.Data;

import java.util.UUID;

@Data
public class UserGroup {
    private UUID id;
    private String userName;
    private UUID groupId;
}