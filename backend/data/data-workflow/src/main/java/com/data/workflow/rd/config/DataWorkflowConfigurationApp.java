package com.data.workflow.rd.config;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;

@Configuration
@ComponentScan(basePackages = "com.data.workflow.rd")
@PropertySource("classpath:application-data-workflow.properties")
public class DataWorkflowConfigurationApp {

    Environment environment;
    public DataWorkflowConfigurationApp(Environment environment) {
        this.environment = environment;
    }
}
