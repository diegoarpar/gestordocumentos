package com.data.workflow.cassandra.config;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.data.cassandra.repository.config.EnableCassandraRepositories;

@Configuration
@EnableCassandraRepositories
@ComponentScan(basePackages = "com.data.workflow.cassandra")
@PropertySource("classpath:application-data-workflow-cassandra.properties")
public class DataWorkflowCassandraConfigurationApp {

    Environment environment;
    public DataWorkflowCassandraConfigurationApp(Environment environment) {
        this.environment = environment;
    }
}
