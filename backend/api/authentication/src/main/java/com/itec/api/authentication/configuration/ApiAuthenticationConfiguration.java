package com.itec.api.authentication.configuration;

import com.data.user.config.DataUsersConfigurationApp;
import com.itec.api.authorization.configuration.UtilAuthorizationConfiguration;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;

/**
 * API authentication configuration.
 *
 * @author diegoarpar
 */
@ComponentScan("com.itec.api.authentication")
@Configuration
@Import({DataUsersConfigurationApp.class, UtilAuthorizationConfiguration.class})
@PropertySource("classpath:api-authentication.properties")
public class ApiAuthenticationConfiguration {
    private final Environment environment;

    public ApiAuthenticationConfiguration(Environment environment) {
        this.environment = environment;
    }
}
