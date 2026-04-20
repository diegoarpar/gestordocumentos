package com.itec.api.workflow.configuration;

import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@Data
public class ApiWorkflowProperties {
    @Value("${worfklow.consumer.id}")
    private String id;

    @Value("${worfklow.crypto.secret}")
    private String secret;
}
