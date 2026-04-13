package com.itec.util.authorization.configuration;

import org.springframework.context.annotation.*;
import org.springframework.core.env.Environment;
import org.springframework.web.client.RestClient;

@Configuration
@ComponentScan(basePackages = "com.itec.util.authorization")
@PropertySource("classpath:util-authorization.properties")
public class UtilAuthorizationConfiguration {
    private final Environment environment;

    public UtilAuthorizationConfiguration(Environment environment) {
        this.environment = environment;
    }

    @Bean
    public RestClient restClient() {
        return RestClient.create();
    }
}
