package com.itec.workflowmanager.model;

import com.itec.utilities.model.BaseServiceResponse;
import lombok.Data;

@Data
public class ProcessDefinitionServiceResponse implements BaseServiceResponse {
    String content;
}
