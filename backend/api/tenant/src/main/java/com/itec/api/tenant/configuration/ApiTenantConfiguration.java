package com.itec.api.tenant.configuration;

import com.data.tenant.config.DataTenantConfigurationApp;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;

@Configuration
@Import({DataTenantConfigurationApp.class})
@PropertySource("classpath:api-tenant.properties")
public class ApiTenantConfiguration {
    private final Environment environment;

    public ApiTenantConfiguration(Environment environment) {
        this.environment = environment;
    }
}
