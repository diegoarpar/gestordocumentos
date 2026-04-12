package com.data.workflow.rd.model;

import lombok.Data;
import lombok.ToString;
import org.springframework.data.cassandra.core.mapping.*;

import java.util.UUID;

@Data
@Table(value = "activity")
@ToString
public class ActivityInformation {

    @PrimaryKey
    UUID id;

    @Column String name;

    @Column
            @Indexed
    String keyName;

    @Column String type;

    @Column String href;

    @Column String description;

    @Column boolean active;
}
