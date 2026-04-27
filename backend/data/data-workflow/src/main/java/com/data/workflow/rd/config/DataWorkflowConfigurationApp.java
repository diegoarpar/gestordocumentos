package com.data.workflow.rd.config;

import com.itec.util.postgresql.service.UtilPostgresqlService;
import com.itec.util.secret.configuration.UtilSecretsConfiguration;
import com.itec.util.secret.services.UtilSecretService;
import org.springframework.context.annotation.*;
import org.springframework.core.env.Environment;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.sql.DataSource;

@Configuration
@ComponentScan(basePackages = "com.data.workflow.rd")
@PropertySource("classpath:application-data-workflow.properties")
@EnableTransactionManagement
@EnableJpaRepositories(
        basePackages = "com.data.workflow.rd",
        entityManagerFactoryRef = "localContainerEntityManagerFactoryBean",
        transactionManagerRef = "transactionManager"
)
@Import(UtilSecretsConfiguration.class)
public class DataWorkflowConfigurationApp {

    public static final String MODULE_NAME = "workflow-postgresql";
    Environment environment;
    public DataWorkflowConfigurationApp(Environment environment, UtilSecretService utilSecretService) {
        this.environment = environment;
        utilSecretService.loadSecrets();
    }

    @Bean("workflowDataSource")
    public DataSource workflowDataSource() {
        var util = new UtilPostgresqlService();
        return util.postgreSql(environment, "workflow-postgresql");
    }

    @Bean("transactionManager")
    public PlatformTransactionManager workflowTransactionManageraSource() {
        var util = new UtilPostgresqlService();
        return util.transactionManager(entityManagerFactory());
    }

    @Primary
    @Bean("localContainerEntityManagerFactoryBean")
    public LocalContainerEntityManagerFactoryBean entityManagerFactory() {
        var util = new UtilPostgresqlService();
        return util.entityManagerFactory(workflowDataSource(), environment, "com.data.workflow.rd.model", MODULE_NAME);
    }
}
