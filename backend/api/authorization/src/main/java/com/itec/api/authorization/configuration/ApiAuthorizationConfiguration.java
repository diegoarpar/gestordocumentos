package com.itec.api.authorization.configuration;

import com.data.user.config.DataUsersConfigurationApp;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;

@Configuration
@Import({DataUsersConfigurationApp.class})
@PropertySource("classpath:api-authorization.properties")
public class ApiAuthorizationConfiguration {
    private final Environment environment;

    public ApiAuthorizationConfiguration(Environment environment) {
        this.environment = environment;
    }
}
