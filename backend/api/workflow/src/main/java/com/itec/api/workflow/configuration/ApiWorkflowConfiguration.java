package com.itec.api.workflow.configuration;

import com.data.workflow.cassandra.config.DataWorkflowCassandraConfigurationApp;
import com.data.workflow.activity.config.ProcessConfigurationApp;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;

@Configuration
@Import({DataWorkflowCassandraConfigurationApp.class, ProcessConfigurationApp.class})
@PropertySource("classpath:api-workflow.properties")
@ComponentScan("com.itec.api.workflow")
public class ApiWorkflowConfiguration {
    private final Environment environment;

    public ApiWorkflowConfiguration(Environment environment) {
        this.environment = environment;
    }
}
