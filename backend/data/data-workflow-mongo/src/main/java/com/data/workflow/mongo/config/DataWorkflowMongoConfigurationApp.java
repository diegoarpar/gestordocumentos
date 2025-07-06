package com.data.workflow.mongo.config;

import com.data.workflow.mongo.model.TaskInformationModel;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

@Configuration
@EntityScan(basePackageClasses = TaskInformationModel.class)
@ComponentScan(basePackages = "com.data.workflow.mongo")
public class DataWorkflowMongoConfigurationApp {

    Environment environment;
    public DataWorkflowMongoConfigurationApp(Environment environment) {
        this.environment = environment;
    }
}
