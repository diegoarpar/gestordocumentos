package com.itec.api.authentication.configuration;

import com.data.user.config.DataUsersConfigurationApp;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;

@Configuration
@Import({DataUsersConfigurationApp.class})
@PropertySource("classpath:api-authentication.properties")
public class ApiAuthenticationConfiguration {
    private final Environment environment;

    public ApiAuthenticationConfiguration(Environment environment) {
        this.environment = environment;
    }
}
