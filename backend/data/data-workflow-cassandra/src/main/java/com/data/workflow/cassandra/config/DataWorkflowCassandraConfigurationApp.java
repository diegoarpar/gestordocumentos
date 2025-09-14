package com.data.workflow.cassandra.config;

import com.data.workflow.cassandra.model.TaskInformationModel;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;

@Configuration
@EntityScan(basePackageClasses = TaskInformationModel.class)
@ComponentScan(basePackages = "com.data.workflow.cassandra")
@PropertySource("classpath:application-data-workflow-cassandra.properties")
public class DataWorkflowCassandraConfigurationApp {

    Environment environment;
    public DataWorkflowCassandraConfigurationApp(Environment environment) {
        this.environment = environment;
    }
}
