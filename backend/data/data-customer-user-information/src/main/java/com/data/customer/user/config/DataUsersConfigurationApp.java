package com.data.customer.user.config;

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

/**
 * Data customer
 *
 * @author diegoarpar
 */
@Configuration
@ComponentScan("com.data.customer.user")
@PropertySource("classpath:application-customer-user.properties")
@EnableTransactionManagement
@EnableJpaRepositories(
        basePackages = "com.data.customer.user.model",
        entityManagerFactoryRef = "localContainerEntityManagerFactoryCustomerDataBean",
        transactionManagerRef = "transactionCustomerDataManager"
)
@Import(UtilSecretsConfiguration.class)
public class DataUsersConfigurationApp {

    Environment environment;
    public DataUsersConfigurationApp(Environment environment, UtilSecretService utilSecretService) {
        this.environment = environment;
        utilSecretService.loadSecrets();
    }

    @Bean("workflowCustomerDataSource")
    public DataSource workflowDataSource() {
        var util = new UtilPostgresqlService();
        return util.postgreSql(environment, "customer-postgresql");
    }

    @Bean("transactionCustomerDataManager")
    public PlatformTransactionManager workflowTransactionManagerSource() {
        var util = new UtilPostgresqlService();
        return util.transactionManager(entityManagerFactory());
    }

    @Primary
    @Bean("localContainerEntityManagerFactoryCustomerDataBean")
    public LocalContainerEntityManagerFactoryBean entityManagerFactory() {
        var util = new UtilPostgresqlService();
        return util.entityManagerFactory(workflowDataSource(), environment, "com.data.authorization.model", "customer-postgresql");
    }
}
