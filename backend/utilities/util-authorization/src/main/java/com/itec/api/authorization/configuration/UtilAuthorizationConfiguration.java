package com.itec.api.authorization.configuration;

import com.data.authorization.configuration.DataAuthorizationConfigurationApp;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;

@Configuration
@Import(DataAuthorizationConfigurationApp.class)
@ComponentScan(basePackages = "com.itec.api.authorization")
@PropertySource("classpath:util-authorization.properties")
public class UtilAuthorizationConfiguration {
    private final Environment environment;

    public UtilAuthorizationConfiguration(Environment environment) {
        this.environment = environment;
    }
}
