package com.data.workflow.activity.model;

import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class ProcessDefinitionResponse {
    private String content;
    private String id;
    private String name;
    private Map<String, String> information;
    private List<Map<String, Object>> taskInformation;
}
