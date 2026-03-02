package com.itec.api.workflow.model;

import com.itec.utilities.model.BaseServiceResponse;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class ProcessDefinitionServiceResponse implements BaseServiceResponse {
    private String content;
    private String id;
    private Map<String, String> processInformation;
    private List<Map<String, Object>> taskInformation;
}
