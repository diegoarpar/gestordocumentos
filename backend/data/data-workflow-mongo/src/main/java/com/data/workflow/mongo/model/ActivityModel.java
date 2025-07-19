package com.data.workflow.mongo.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(value = "activity")
public record ActivityModel(
        @Id String id,
        String name){
}
