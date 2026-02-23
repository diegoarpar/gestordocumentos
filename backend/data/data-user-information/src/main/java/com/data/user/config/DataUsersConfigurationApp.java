package com.data.user.config;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;

@Configuration
@ComponentScan("com.data.user")
@PropertySource("classpath:application-user.properties")
public class DataUsersConfigurationApp {

    Environment environment;
    public DataUsersConfigurationApp(Environment environment) {
        this.environment = environment;
    }
}
