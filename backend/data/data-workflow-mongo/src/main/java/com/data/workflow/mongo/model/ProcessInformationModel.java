package com.data.workflow.mongo.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(value = "process")
public record ProcessInformationModel (
    @Id Long id,
    String name,
    @Indexed(expireAfter = "1s")
    LocalDateTime expireDate
){
}
