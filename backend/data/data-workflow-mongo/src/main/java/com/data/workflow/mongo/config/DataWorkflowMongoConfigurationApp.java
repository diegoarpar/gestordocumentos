package com.data.workflow.mongo.config;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@Configuration
@ComponentScan(basePackages = "com.data.workflow.mongo")
@PropertySource("classpath:application-mongo.properties")
public class DataWorkflowMongoConfigurationApp {

    Environment environment;
    public DataWorkflowMongoConfigurationApp(Environment environment) {
        this.environment = environment;
    }
}
