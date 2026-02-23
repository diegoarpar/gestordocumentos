package com.data.customer.user.config;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;

/**
 * Data customer
 *
 * @author diegoarpar
 */
@Configuration
@ComponentScan("com.data.customer.user")
@PropertySource("classpath:application-customer-user.properties")
public class DataUsersConfigurationApp {

    Environment environment;
    public DataUsersConfigurationApp(Environment environment) {
        this.environment = environment;
    }
}
