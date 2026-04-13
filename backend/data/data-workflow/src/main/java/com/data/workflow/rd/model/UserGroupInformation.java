package com.data.workflow.rd.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.UUID;

@Data
@Entity
public class UserGroupInformation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    String userName;

    private UUID groupId;

}
