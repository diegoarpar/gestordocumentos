package com.itec.workflowadministration.config;

import com.data.workflow.mongo.config.DataWorkflowMongoConfigurationApp;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

@Configuration
@ConfigurationProperties("application.properties")
@ComponentScan("com.itec.workflowadministration")
@Import({DataWorkflowMongoConfigurationApp.class})
public class WorkflowAdministrationConfig {
}
