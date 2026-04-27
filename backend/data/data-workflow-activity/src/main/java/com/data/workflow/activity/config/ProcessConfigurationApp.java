package com.data.workflow.activity.config;

import com.itec.util.secret.configuration.UtilSecretsConfiguration;
import com.itec.util.secret.services.UtilSecretService;
import org.activiti.engine.ProcessEngine;
import org.activiti.engine.ProcessEngineConfiguration;
import org.activiti.engine.impl.cfg.StandaloneProcessEngineConfiguration;
import org.springframework.context.annotation.*;
import org.springframework.core.env.Environment;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Configuration
@PropertySource("classpath:workflow-activity.properties")
@ComponentScan("com.data.workflow.activity")
@Import(UtilSecretsConfiguration.class)
public class ProcessConfigurationApp {
    private final Environment environment;
    public ProcessConfigurationApp(Environment environment, UtilSecretService utilSecretService) {
        this.environment = environment;
        utilSecretService.loadSecrets();
    }

    @Bean(name = "processEngine")
    public Map<String, ProcessEngine> initProcessEngine() throws IOException {
        Map<String, ProcessEngine> processEngineMap = new HashMap<String, ProcessEngine>();
        ProcessEngineConfiguration cfg = new StandaloneProcessEngineConfiguration()
                .setJdbcUrl(environment.getProperty("data.workflow-activity.url"))
                .setJdbcUsername(environment.getProperty("data.workflow-activity.username"))
                .setJdbcPassword(environment.getProperty("data.workflow-activity.password"))
                .setJdbcDriver(environment.getProperty("data.workflow-activity.driver"))
                .setDatabaseSchemaUpdate(environment.getProperty("data.workflow-activity.ddl"));
        ProcessEngine processEngine = cfg.buildProcessEngine();
        String pName = processEngine.getName();
        String ver = ProcessEngine.VERSION;
        System.out.println("ProcessEngine [" + pName + "] Version: [" + ver + "]");
        processEngineMap.put(environment.getProperty("env"), processEngine);
        return processEngineMap;
    }
}
