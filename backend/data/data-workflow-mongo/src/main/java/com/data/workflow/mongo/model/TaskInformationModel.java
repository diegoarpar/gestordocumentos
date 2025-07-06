package com.data.workflow.mongo.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(value = "task")
public record TaskInformationModel(
        @Id Long id,
        String name){
}
