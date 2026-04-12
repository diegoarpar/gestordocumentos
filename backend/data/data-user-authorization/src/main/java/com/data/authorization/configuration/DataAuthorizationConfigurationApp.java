package com.data.authorization.configuration;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;

@Configuration
@ComponentScan("com.data.authorization")
@PropertySource("classpath:data-authorization.properties")
public class DataAuthorizationConfigurationApp {

    Environment environment;
    public DataAuthorizationConfigurationApp(Environment environment) {
        this.environment = environment;
    }
}
