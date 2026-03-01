package com.itec.api.workflow.model;

import lombok.Data;

import java.util.UUID;

@Data
public class Permission {
    private UUID id;
    private String name;
    private String description;
    private boolean active;
}
