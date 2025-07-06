package com.itec.workflowadministration.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties("application.properties")
@ComponentScan("com.itec.workflowadministration")
public class WorkflowAdministrationConfig {
}
