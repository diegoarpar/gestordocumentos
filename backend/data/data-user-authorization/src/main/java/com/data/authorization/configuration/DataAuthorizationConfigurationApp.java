package com.data.authorization.configuration;

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
@ComponentScan("com.data.authorization")
@PropertySource("classpath:data-authorization.properties")
@EnableTransactionManagement
@EnableJpaRepositories(
        basePackages = "com.data.authorization",
        entityManagerFactoryRef = "localContainerEntityManagerFactoryAuthorizationBean",
        transactionManagerRef = "transactionAuthorizationManager"
)
@Import(UtilSecretsConfiguration.class)
public class DataAuthorizationConfigurationApp {

    Environment environment;
    public DataAuthorizationConfigurationApp(Environment environment, UtilSecretService utilSecretService) {
        this.environment = environment;
        utilSecretService.loadSecrets();
    }

    @Bean("workflowAuthorizationDataSource")
    public DataSource workflowDataSource() {
        var util = new UtilPostgresqlService();
        return util.postgreSql(environment, "authorization-postgresql");
    }

    @Bean("transactionAuthorizationManager")
    public PlatformTransactionManager workflowTransactionManagerSource() {
        var util = new UtilPostgresqlService();
        return util.transactionManager(entityManagerFactory());
    }

    @Primary
    @Bean("localContainerEntityManagerFactoryAuthorizationBean")
    public LocalContainerEntityManagerFactoryBean entityManagerFactory() {
        var util = new UtilPostgresqlService();
        return util.entityManagerFactory(workflowDataSource(), environment, "com.data.authorization", "authorization-postgresql");
    }
}
