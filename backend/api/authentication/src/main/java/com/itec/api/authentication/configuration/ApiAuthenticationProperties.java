package com.itec.api.authentication.configuration;

import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@Data
public class ApiAuthenticationProperties {

    @Value("${authentication.consumer.id}")
    private String id;
}
