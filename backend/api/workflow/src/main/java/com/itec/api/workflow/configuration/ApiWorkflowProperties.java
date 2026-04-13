package com.itec.api.workflow.configuration;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "app.consumer")
@Data
public class ApiWorkflowProperties {
    private String id;
    private String secret;
}
