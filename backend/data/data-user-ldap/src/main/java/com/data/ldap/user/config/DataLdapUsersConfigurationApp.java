package com.data.ldap.user.config;

import com.itec.util.secret.configuration.UtilSecretsConfiguration;
import com.itec.util.secret.services.UtilSecretService;
import org.springframework.context.annotation.*;
import org.springframework.core.env.Environment;

@Configuration
@ComponentScan("com.data.ldap.user")
@PropertySource("classpath:application-user-ldap.properties")
@Import(UtilSecretsConfiguration.class)
public class DataLdapUsersConfigurationApp {

    Environment environment;
    public DataLdapUsersConfigurationApp(Environment environment, UtilSecretService utilSecretService) {
        this.environment = environment;
        utilSecretService.loadSecrets();
    }

}
