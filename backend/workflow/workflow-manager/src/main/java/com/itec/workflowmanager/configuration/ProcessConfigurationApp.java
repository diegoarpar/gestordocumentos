package com.itec.workflowmanager.configuration;

import org.activiti.engine.ProcessEngine;
import org.activiti.engine.ProcessEngineConfiguration;
import org.activiti.engine.impl.cfg.StandaloneProcessEngineConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Configuration
@PropertySource("classpath:process-dev.properties")
public class ProcessConfigurationApp {
    private final Environment environment;
    public ProcessConfigurationApp(Environment environment) {
        this.environment = environment;
    }

    @Bean(name = "processEngine")
    public Map<String, ProcessEngine> initProcessEngine() throws IOException {
        Map<String, ProcessEngine> processEngineMap = new HashMap<String, ProcessEngine>();
        ProcessEngineConfiguration cfg = new StandaloneProcessEngineConfiguration()
                .setJdbcUrl(environment.getProperty("activity.url"))
                .setJdbcUsername(environment.getProperty("activity.user"))
                .setJdbcPassword(environment.getProperty("activity.password"))
                .setJdbcDriver(environment.getProperty("activity.driver"))
                .setDatabaseSchemaUpdate(environment.getProperty("activity.schema.update"));
        ProcessEngine processEngine = cfg.buildProcessEngine();
        String pName = processEngine.getName();
        String ver = ProcessEngine.VERSION;
        System.out.println("ProcessEngine [" + pName + "] Version: [" + ver + "]");
        processEngineMap.put(environment.getProperty("env"), processEngine);
        return processEngineMap;
    }
}
