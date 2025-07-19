package com.data.workflow.mongo.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(value = "process")
public record ProcessModel(
    @Id String id,
    String name,
    @Indexed(expireAfter = "1s")
    LocalDateTime expireDate,
    List<FormModel> forms,
    List<ActivityModel> activities
){
}
