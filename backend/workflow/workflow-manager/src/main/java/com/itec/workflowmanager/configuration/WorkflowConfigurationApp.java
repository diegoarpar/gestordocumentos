package com.itec.workflowmanager.configuration;

import com.data.workflow.cassandra.config.DataWorkflowCassandraConfigurationApp;
import com.data.workflow.cassandra.model.TaskInformation;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.core.env.Environment;

@Configuration
@Import({ProcessConfigurationApp.class, DataWorkflowCassandraConfigurationApp.class})
@EntityScan(basePackageClasses = TaskInformation.class)
public class WorkflowConfigurationApp {

    Environment environment;
    public WorkflowConfigurationApp(Environment environment) {
        this.environment = environment;
    }
}
