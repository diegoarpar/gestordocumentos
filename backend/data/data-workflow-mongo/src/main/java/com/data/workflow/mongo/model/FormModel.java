package com.data.workflow.mongo.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(value = "form")
public record FormModel(
        @Id String id,
        String name){
}
