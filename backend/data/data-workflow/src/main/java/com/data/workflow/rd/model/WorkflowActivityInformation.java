package com.data.workflow.rd.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.UUID;

@Data
@Entity
public class WorkflowActivityInformation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private UUID workflowId;

    private UUID activityId;
}
