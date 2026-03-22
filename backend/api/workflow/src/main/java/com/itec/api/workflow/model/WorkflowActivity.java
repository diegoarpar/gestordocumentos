package com.itec.api.workflow.model;

import lombok.Data;

import java.util.UUID;

@Data
public class WorkflowActivity {
    private UUID id;
    private UUID workflowId;
    private UUID activityId;
}
