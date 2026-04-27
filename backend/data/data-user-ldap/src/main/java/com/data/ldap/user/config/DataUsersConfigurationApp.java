package com.data.ldap.user.config;

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
@ComponentScan("com.data.user")
@PropertySource("classpath:application-user-ldap.properties")
@EnableTransactionManagement
@EnableJpaRepositories(
        basePackages = "com.data.user",
        entityManagerFactoryRef = "localContainerEntityManagerFactoryUserBean",
        transactionManagerRef = "transactionUserManager"
)
@Import(UtilSecretsConfiguration.class)
public class DataUsersConfigurationApp {

    Environment environment;
    public DataUsersConfigurationApp(Environment environment, UtilSecretService utilSecretService) {
        this.environment = environment;
        utilSecretService.loadSecrets();
    }

    @Bean("workflowUserDataSource")
    public DataSource workflowDataSource() {
        var util = new UtilPostgresqlService();
        return util.postgreSql(environment, "user-postgresql");
    }

    @Bean("transactionUserManager")
    public PlatformTransactionManager workflowTransactionManagerSource() {
        var util = new UtilPostgresqlService();
        return util.transactionManager(entityManagerFactory());
    }

    @Primary
    @Bean("localContainerEntityManagerFactoryUserBean")
    public LocalContainerEntityManagerFactoryBean entityManagerFactory() {
        var util = new UtilPostgresqlService();
        return util.entityManagerFactory(workflowDataSource(), environment, "com.data.user", "user-postgresql");
    }
}
