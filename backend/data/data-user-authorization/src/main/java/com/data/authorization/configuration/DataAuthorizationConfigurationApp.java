package com.data.authorization.configuration;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.data.cassandra.repository.config.EnableCassandraRepositories;

@Configuration
@ComponentScan(basePackages = "com.data.authorization")
@PropertySource("classpath:data-authorization.properties")
@EnableCassandraRepositories
public class DataAuthorizationConfigurationApp {

    Environment environment;
    public DataAuthorizationConfigurationApp(Environment environment) {
        this.environment = environment;
    }
}
