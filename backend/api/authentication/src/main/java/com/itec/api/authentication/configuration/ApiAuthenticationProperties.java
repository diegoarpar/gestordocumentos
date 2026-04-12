package com.itec.api.authentication.configuration;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "app.consumer")
@Data
public class ApiAuthenticationProperties {
    private String id;
}
