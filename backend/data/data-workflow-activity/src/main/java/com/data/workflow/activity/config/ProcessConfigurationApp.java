package com.data.workflow.activity.config;

import org.activiti.engine.ProcessEngine;
import org.activiti.engine.ProcessEngineConfiguration;
import org.activiti.engine.impl.cfg.StandaloneProcessEngineConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Configuration
@PropertySource("classpath:workflow-activity.properties")
@ComponentScan("com.data.workflow.activity")
public class ProcessConfigurationApp {
    private final Environment environment;
    public ProcessConfigurationApp(Environment environment) {
        this.environment = environment;
    }

    @Bean(name = "processEngine")
    public Map<String, ProcessEngine> initProcessEngine() throws IOException {
        Map<String, ProcessEngine> processEngineMap = new HashMap<String, ProcessEngine>();
        ProcessEngineConfiguration cfg = new StandaloneProcessEngineConfiguration()
                .setJdbcUrl(environment.getProperty("spring.datasource.url"))
                .setJdbcUsername(environment.getProperty("spring.datasource.username"))
                .setJdbcPassword(environment.getProperty("spring.datasource.password"))
                .setJdbcDriver(environment.getProperty("spring.datasource.driver-class-name"))
                .setDatabaseSchemaUpdate(environment.getProperty("spring.jpa.hibernate.ddl-auto"));
        ProcessEngine processEngine = cfg.buildProcessEngine();
        String pName = processEngine.getName();
        String ver = ProcessEngine.VERSION;
        System.out.println("ProcessEngine [" + pName + "] Version: [" + ver + "]");
        processEngineMap.put(environment.getProperty("env"), processEngine);
        return processEngineMap;
    }
}
