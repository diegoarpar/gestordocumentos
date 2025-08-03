package com.data.tenant.config;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;

@Configuration
@ComponentScan(basePackages = "com.data.tenant")
@PropertySource("classpath:service-application-tenant.properties")
public class DataTenantConfigurationApp {

    Environment environment;
    public DataTenantConfigurationApp(Environment environment) {
        this.environment = environment;
    }
}
