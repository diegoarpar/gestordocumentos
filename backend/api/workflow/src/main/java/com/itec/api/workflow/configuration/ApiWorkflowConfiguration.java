package com.itec.api.workflow.configuration;

import com.data.workflow.rd.config.DataWorkflowConfigurationApp;
import com.data.workflow.activity.config.ProcessConfigurationApp;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;

@Configuration
@Import({DataWorkflowConfigurationApp.class, ProcessConfigurationApp.class})
@PropertySource("classpath:api-workflow.properties")
@ComponentScan("com.itec.api.workflow")
public class ApiWorkflowConfiguration {
    private final Environment environment;

    public ApiWorkflowConfiguration(Environment environment) {
        this.environment = environment;
    }
}
