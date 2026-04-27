package com.data.workflow.cassandra.config;

import com.datastax.oss.driver.api.core.CqlSession;
import com.itec.util.secret.configuration.UtilSecretsConfiguration;
import com.itec.util.secret.services.UtilSecretService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.*;
import org.springframework.core.env.Environment;
import org.springframework.data.cassandra.core.CassandraTemplate;
import org.springframework.data.cassandra.repository.config.EnableCassandraRepositories;

import java.net.InetSocketAddress;

@Configuration
@EnableCassandraRepositories
@ComponentScan(basePackages = "com.data.workflow.cassandra")
@Import(UtilSecretsConfiguration.class)
@PropertySource("classpath:application-data-workflow-cassandra.properties")
public class DataWorkflowCassandraConfigurationApp {

    Environment environment;
    public DataWorkflowCassandraConfigurationApp(Environment environment, UtilSecretService utilSecretService) {
        this.environment = environment;
        utilSecretService.loadSecrets();
    }

    @Value("${data.workflow.cassandra.username}") String username;
    @Value("${data.workflow.cassandra.password}") String password;
    @Value("${data.workflow.cassandra.contact-points}") String contactPoints;
    @Value("${data.workflow.cassandra.port}") String port;
    @Value("${data.workflow.cassandra.keyspace-name}") String keySpace;
    @Value("${data.workflow.cassandra.data-center}") String datacenter;

    @Bean("workflowCassandra")
    public CqlSession cassandraSession() {
        return CqlSession.builder()
                .addContactPoint(new InetSocketAddress(contactPoints, Integer.parseInt(port)))
                .withAuthCredentials(username, password)
                .withLocalDatacenter("datacenter1")
                .withKeyspace(keySpace)
                .withLocalDatacenter(datacenter)
                .build();
    }

    @Bean("workflowCassandraTemplate")
    public CassandraTemplate workflowCassandraTemplate() {
        return new CassandraTemplate(cassandraSession());
    }
}
